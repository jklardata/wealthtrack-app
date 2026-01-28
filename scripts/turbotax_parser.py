#!/usr/bin/env python3
"""
TurboTax PDF Parser

Extracts tax return data from TurboTax PDF files and outputs to CSV format
compatible with WealthTrack app upload.

Usage:
    python turbotax_parser.py input.pdf -o output.csv
    python turbotax_parser.py *.pdf -o all_returns.csv
    python turbotax_parser.py input.pdf -o output.csv -v
"""

import argparse
import re
import sys
from dataclasses import dataclass, field, asdict
from decimal import Decimal
from pathlib import Path
from typing import Optional

import pandas as pd
import pdfplumber


@dataclass
class TaxReturnData:
    """Data structure matching WealthTrack tax_returns schema"""
    tax_year: int = 0
    filing_status: str = 'single'

    # Income
    wages: Decimal = Decimal('0')
    interest_income: Decimal = Decimal('0')
    dividend_income: Decimal = Decimal('0')
    qualified_dividends: Decimal = Decimal('0')
    capital_gains: Decimal = Decimal('0')
    ira_distributions: Decimal = Decimal('0')
    pension_income: Decimal = Decimal('0')
    social_security: Decimal = Decimal('0')
    business_income: Decimal = Decimal('0')
    other_income: Decimal = Decimal('0')
    total_income: Decimal = Decimal('0')
    agi: Decimal = Decimal('0')

    # Deductions
    adjustments: Decimal = Decimal('0')
    deduction_type: str = 'standard'
    deduction_amount: Decimal = Decimal('0')
    qbi_deduction: Decimal = Decimal('0')
    taxable_income: Decimal = Decimal('0')

    # Tax & Payments
    total_tax: Decimal = Decimal('0')
    federal_withheld: Decimal = Decimal('0')
    estimated_payments: Decimal = Decimal('0')
    refund_amount: Decimal = Decimal('0')
    amount_owed: Decimal = Decimal('0')
    effective_tax_rate: Decimal = Decimal('0')

    # Self-employment
    se_income: Decimal = Decimal('0')
    se_tax: Decimal = Decimal('0')
    se_deduction: Decimal = Decimal('0')

    # Metadata
    notes: str = ''

    def calculate_effective_rate(self):
        """Calculate effective tax rate as total_tax / agi"""
        if self.agi > 0:
            self.effective_tax_rate = round(self.total_tax / self.agi, 4)

    def to_dict(self):
        """Convert to dictionary with Decimal converted to float"""
        d = asdict(self)
        for key, value in d.items():
            if isinstance(value, Decimal):
                d[key] = float(value)
        return d


class TurboTaxParser:
    """Parser for TurboTax PDF returns"""

    # Filing status mapping
    FILING_STATUS_MAP = {
        'single': 'single',
        'married filing jointly': 'married_filing_jointly',
        'married filing joint': 'married_filing_jointly',
        'married filing separately': 'married_filing_separately',
        'married filing separate': 'married_filing_separately',
        'head of household': 'head_of_household',
        'qualifying widow': 'qualifying_widow',
        'qualifying surviving spouse': 'qualifying_widow',
    }

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.text = ''
        self.data = TaxReturnData()

    def log(self, message: str):
        """Print message if verbose mode is enabled"""
        if self.verbose:
            print(f"[DEBUG] {message}")

    def parse_pdf(self, pdf_path: str) -> TaxReturnData:
        """Parse a TurboTax PDF and extract tax return data"""
        self.data = TaxReturnData()
        self.text = ''

        # Extract text from PDF using multiple methods
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                # Try layout-preserving extraction first (better for forms)
                try:
                    page_text = page.extract_text(layout=True) or ''
                except:
                    page_text = page.extract_text() or ''
                self.text += page_text + '\n'

                # Also extract words and join them (backup method)
                words = page.extract_words()
                if words:
                    word_text = ' '.join(w['text'] for w in words)
                    self.text += word_text + '\n'

        self.log(f"Extracted {len(self.text)} characters from PDF")

        # Parse different sections
        self._parse_tax_year()
        self._parse_filing_status()
        self._parse_income()
        self._parse_deductions()
        self._parse_tax_payments()
        self._parse_schedule_c()
        self._parse_schedule_se()

        # Calculate derived fields
        self.data.calculate_effective_rate()
        self.data.notes = f'Imported from TurboTax PDF: {Path(pdf_path).name}'

        return self.data

    def _parse_amount(self, pattern: str, text: str = None) -> Decimal:
        """Extract a dollar amount using regex pattern"""
        if text is None:
            text = self.text

        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if match:
            amount_str = match.group(1) if match.lastindex else match.group(0)
            # Clean the amount string
            amount_str = amount_str.replace(',', '').replace('$', '').strip()
            # Handle parentheses for negative numbers
            if amount_str.startswith('(') and amount_str.endswith(')'):
                amount_str = '-' + amount_str[1:-1]
            try:
                return Decimal(amount_str)
            except:
                pass
        return Decimal('0')

    def _parse_turbotax_line(self, line_num: str, description_pattern: str = None) -> Decimal:
        """
        Parse TurboTax format: "Description, line XX . . . . XX AMOUNT"

        Args:
            line_num: The line number to find (e.g., "1", "1a", "10")
            description_pattern: Optional regex pattern to match the description

        TurboTax format example:
            "Adjustments to income from Schedule 1, line 26 . . . . 10 85,686"
        The line number appears twice - once in description, once before amount.
        Amount is typically 3+ digits with optional commas.
        """
        patterns = []

        # Pattern 1: Description pattern followed by dots, line num, and large amount (3+ digits)
        if description_pattern:
            patterns.append(
                rf'{description_pattern}[^\.]*\.{{2,}}\s*{line_num}\s+([\d]{{1,3}}(?:,\d{{3}})*(?:\.\d{{2}})?)'
            )

        # Pattern 2: Line number followed by amount that's clearly a dollar amount (has comma or 4+ digits)
        patterns.extend([
            # Amount with comma: ". . . 10 85,686"
            rf'\.{{2,}}\s*{line_num}\s+([\d]{{1,3}}(?:,\d{{3}})+(?:\.\d{{2}})?)',
            # Amount 4+ digits without comma: ". . . 10 85686"
            rf'\.{{2,}}\s*{line_num}\s+(\d{{4,}}(?:\.\d{{2}})?)',
            # Amount 1-3 digits but followed by period or end (not another digit): ". . . 10 123."
            rf'\.{{2,}}\s*{line_num}\s+(\d{{1,3}})(?:\.(?!\d)|[^\d,]|$)',
        ])

        for pattern in patterns:
            try:
                match = re.search(pattern, self.text, re.IGNORECASE)
                if match and match.group(1):
                    amount_str = match.group(1).replace(',', '').rstrip('.')
                    if amount_str:
                        amount = Decimal(amount_str)
                        # Skip if amount looks like a line number (single digit 1-9 followed by nothing useful)
                        if amount < 50 and not description_pattern:
                            continue  # Likely a line number, not an amount
                        self.log(f"  Found line {line_num}: {amount} (pattern: {pattern[:60]}...)")
                        return amount
            except Exception as e:
                self.log(f"  Pattern error for line {line_num}: {e}")
                continue

        return Decimal('0')

    def _parse_by_line(self, line_id: str) -> Decimal:
        """
        Parse TurboTax format: "Description . . . . LINE_ID AMOUNT."

        Examples:
            "Total amount from Form(s) W-2, box 1 . . . . 1a 17,380."
            "Capital gain or (loss) . . . . 7 -3,000."
            "This is your adjusted gross income . . . . 11 393,713."

        Args:
            line_id: The line identifier (e.g., "1a", "1z", "7", "10", "11")
        """
        # Pattern: dots (possibly with spaces like ". . . .") followed by line_id, then amount
        # The dots can be ". . . ." or "......" - we match either
        # Amount format: optional minus, digits with commas, ending with period
        pattern = rf'(?:\.\s*)+\s*{line_id}\s+(-?[\d,]+)\.'

        match = re.search(pattern, self.text)
        if match:
            amount_str = match.group(1).replace(',', '')
            try:
                amount = Decimal(amount_str)
                self.log(f"  Found line {line_id}: {amount}")
                return amount
            except:
                pass

        return Decimal('0')

    def _parse_by_description(self, description_pattern: str) -> Decimal:
        """
        Parse amount by finding description text followed by dots, line number, and amount.

        TurboTax format: "Description text . . . . . LINE_NUM AMOUNT."
        Example: "Adjustments to income from Schedule 1, line 26 . . . . 10 85,686."

        The amount always ends with a period.
        """
        # Find description followed by dots, then line number, then amount ending with period
        # Pattern captures the amount (possibly negative, with commas, ending with period)
        pattern = rf'{description_pattern}[^\.]*\.{{2,}}\s*\w+\s+(-?[\d,]+)\.'

        match = re.search(pattern, self.text, re.IGNORECASE)
        if match:
            amount_str = match.group(1).replace(',', '')
            try:
                amount = Decimal(amount_str)
                self.log(f"  Found by desc '{description_pattern[:30]}...': {amount}")
                return amount
            except:
                pass

        return Decimal('0')

    def _parse_tax_year(self):
        """Extract tax year from the document"""
        # Look for patterns like "2024 Form 1040" or "Tax Year 2024"
        patterns = [
            r'(\d{4})\s*Form\s*1040',
            r'Tax\s*Year\s*(\d{4})',
            r'Form\s*1040.*?(\d{4})',
            r'(\d{4})\s*U\.?S\.?\s*Individual',
        ]

        for pattern in patterns:
            match = re.search(pattern, self.text, re.IGNORECASE)
            if match:
                year = int(match.group(1))
                if 2000 <= year <= 2030:  # Sanity check
                    self.data.tax_year = year
                    self.log(f"Found tax year: {year}")
                    return

        self.log("Could not find tax year, defaulting to 0")

    def _parse_filing_status(self):
        """Extract filing status"""
        # Look for filing status indicators
        patterns = [
            r'Filing\s*Status[:\s]+([A-Za-z\s]+?)(?:\n|$)',
            r'(?:Your\s+)?Filing\s*Status[:\s]+([A-Za-z\s]+?)(?:\n|$)',
            r'\[\s*X?\s*\]\s*(Single|Married filing jointly|Married filing separately|Head of household|Qualifying)',
        ]

        for pattern in patterns:
            match = re.search(pattern, self.text, re.IGNORECASE)
            if match:
                status = match.group(1).strip().lower()
                for key, value in self.FILING_STATUS_MAP.items():
                    if key in status:
                        self.data.filing_status = value
                        self.log(f"Found filing status: {value}")
                        return

        # Check for individual status keywords
        if re.search(r'\bsingle\b', self.text, re.IGNORECASE):
            self.data.filing_status = 'single'
        elif re.search(r'married\s+filing\s+jointly', self.text, re.IGNORECASE):
            self.data.filing_status = 'married_filing_jointly'
        elif re.search(r'head\s+of\s+household', self.text, re.IGNORECASE):
            self.data.filing_status = 'head_of_household'

        self.log(f"Filing status: {self.data.filing_status}")

    def _parse_income(self):
        """Extract income fields from Form 1040"""
        # Line 1z: Total wages (sum of 1a-1h)
        self.data.wages = self._parse_by_line('1z')
        if self.data.wages == 0:
            self.data.wages = self._parse_by_line('1a')
        self.log(f"Wages (Line 1z): {self.data.wages}")

        # Line 2b: Taxable interest
        self.data.interest_income = self._parse_by_line('2b')
        self.log(f"Interest (Line 2b): {self.data.interest_income}")

        # Line 3a: Qualified dividends
        self.data.qualified_dividends = self._parse_by_line('3a')
        self.log(f"Qualified dividends (Line 3a): {self.data.qualified_dividends}")

        # Line 3b: Ordinary dividends
        self.data.dividend_income = self._parse_by_line('3b')
        self.log(f"Dividends (Line 3b): {self.data.dividend_income}")

        # Line 4b: Taxable IRA distributions (must be non-negative)
        self.data.ira_distributions = self._parse_by_line('4b')
        if self.data.ira_distributions < 0:
            self.data.ira_distributions = Decimal('0')  # IRA distributions can't be negative
        self.log(f"IRA distributions (Line 4b): {self.data.ira_distributions}")

        # Line 5b: Taxable pensions
        self.data.pension_income = self._parse_by_line('5b')
        self.log(f"Pensions (Line 5b): {self.data.pension_income}")

        # Line 6b: Social Security (taxable)
        self.data.social_security = self._parse_by_line('6b')
        self.log(f"Social Security (Line 6b): {self.data.social_security}")

        # Line 7: Capital gains (can be negative)
        self.data.capital_gains = self._parse_by_line('7')
        self.log(f"Capital gains (Line 7): {self.data.capital_gains}")

        # Line 8: Other/Additional income from Schedule 1
        self.data.other_income = self._parse_by_line('8')
        self.log(f"Other income (Line 8): {self.data.other_income}")

        # Line 9: Total income
        self.data.total_income = self._parse_by_line('9')
        self.log(f"Total income (Line 9): {self.data.total_income}")

        # Line 10: Adjustments to income
        self.data.adjustments = self._parse_by_line('10')
        self.log(f"Adjustments (Line 10): {self.data.adjustments}")

        # Line 11: AGI
        self.data.agi = self._parse_by_line('11')
        self.log(f"AGI (Line 11): {self.data.agi}")

    def _parse_deductions(self):
        """Extract deduction fields"""
        # Line 12: Standard or itemized deduction
        self.data.deduction_amount = self._parse_by_line('12')

        # Determine if itemized - look for "Itemized deductions (from Schedule A)"
        # vs "Standard deduction or itemized deductions (from Schedule A)"
        # If the amount matches standard deduction amounts, it's likely standard
        standard_amounts = [13850, 27700, 20800, 14600, 29200]  # 2023/2024 standard deductions

        if self.data.deduction_amount in [Decimal(str(x)) for x in standard_amounts]:
            self.data.deduction_type = 'standard'
        elif re.search(r'Itemized\s+deductions\s+from\s+Schedule\s*A[^\.]*\.\s*\.*\s*12', self.text, re.IGNORECASE):
            self.data.deduction_type = 'itemized'
        else:
            self.data.deduction_type = 'standard'
        self.log(f"Deduction ({self.data.deduction_type}): {self.data.deduction_amount}")

        # Line 13: QBI deduction
        self.data.qbi_deduction = self._parse_by_line('13')
        self.log(f"QBI deduction (Line 13): {self.data.qbi_deduction}")

        # Line 15: Taxable income
        self.data.taxable_income = self._parse_by_line('15')
        self.log(f"Taxable income (Line 15): {self.data.taxable_income}")

    def _parse_tax_payments(self):
        """Extract tax and payment fields"""
        # Line 16: Tax
        tax_line_16 = self._parse_by_line('16')
        self.log(f"Tax (Line 16): {tax_line_16}")

        # Line 24: Total tax
        self.data.total_tax = self._parse_by_line('24')
        self.log(f"Total tax (Line 24): {self.data.total_tax}")

        # Line 25a: Federal tax withheld from W-2
        withheld_25a = self._parse_by_line('25a')

        # Line 25d: Total federal tax withheld
        self.data.federal_withheld = self._parse_by_line('25d')
        if self.data.federal_withheld == 0:
            self.data.federal_withheld = withheld_25a
        self.log(f"Federal withheld (Line 25d): {self.data.federal_withheld}")

        # Line 26: Estimated tax payments
        self.data.estimated_payments = self._parse_by_line('26')
        self.log(f"Estimated payments (Line 26): {self.data.estimated_payments}")

        # Line 33: Total payments
        total_payments = self._parse_by_line('33')
        self.log(f"Total payments (Line 33): {total_payments}")

        # Line 34: Overpaid/Refund
        self.data.refund_amount = self._parse_by_line('34')
        self.log(f"Refund (Line 34): {self.data.refund_amount}")

        # Line 37: Amount owed
        self.data.amount_owed = self._parse_by_line('37')
        # If there's a refund, amount_owed should be 0 (can't have both)
        if self.data.refund_amount > 0:
            self.data.amount_owed = Decimal('0')
        self.log(f"Amount owed (Line 37): {self.data.amount_owed}")

    def _parse_schedule_c(self):
        """Extract Schedule C (self-employment) data"""
        # Schedule C Line 31: Net profit or loss
        # Look for "Net profit or (loss) . . . 31 AMOUNT."
        pattern = r'\b31\s+(-?[\d,]+)\.'
        match = re.search(pattern, self.text)
        if match:
            self.data.business_income = Decimal(match.group(1).replace(',', ''))
            self.log(f"Business income (Schedule C Line 31): {self.data.business_income}")
            return

        # Alternative: Look for business income on Schedule 1
        # "Business income or (loss). Attach Schedule C . . . 3 AMOUNT."
        alt_pattern = r'Business\s+income\s+or\s+\(loss\)[^\.]*\.{2,}\s*3\s+(-?[\d,]+)\.'
        match = re.search(alt_pattern, self.text, re.IGNORECASE)
        if match:
            self.data.business_income = Decimal(match.group(1).replace(',', ''))
            self.log(f"Business income (Schedule 1 Line 3): {self.data.business_income}")

    def _parse_schedule_se(self):
        """Extract Schedule SE (self-employment tax) data"""
        # Line 23 on Schedule 2: "Self-employment tax . . . 4 AMOUNT."
        # Note: SE tax typically appears on Schedule 2, line 4
        pattern = r'Self-employment\s+tax[^\.]*\.{2,}\s*\d+\s+([\d,]+)\.'
        match = re.search(pattern, self.text, re.IGNORECASE)
        if match:
            self.data.se_tax = Decimal(match.group(1).replace(',', ''))
            self.log(f"SE tax: {self.data.se_tax}")

        # SE income (usually same as Schedule C net profit)
        if self.data.business_income > 0:
            self.data.se_income = self.data.business_income

        # SE deduction - "Deductible part of self-employment tax . . . 15 AMOUNT."
        se_ded_pattern = r'Deductible\s+part\s+of\s+self-employment\s+tax[^\.]*\.{2,}\s*\d+\s+([\d,]+)\.'
        match = re.search(se_ded_pattern, self.text, re.IGNORECASE)
        if match:
            self.data.se_deduction = Decimal(match.group(1).replace(',', ''))
            self.log(f"SE deduction: {self.data.se_deduction}")
        elif self.data.se_tax > 0:
            # Calculate if not found (SE deduction = half of SE tax)
            self.data.se_deduction = self.data.se_tax / 2
            self.log(f"SE deduction (calculated): {self.data.se_deduction}")


def main():
    parser = argparse.ArgumentParser(
        description='Parse TurboTax PDF returns and export to CSV',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
  %(prog)s return.pdf -o taxes.csv
  %(prog)s 2022.pdf 2023.pdf 2024.pdf -o all_years.csv
  %(prog)s return.pdf -o taxes.csv -v
  %(prog)s return.pdf -o taxes.csv --dump-text
        '''
    )
    parser.add_argument('input', nargs='+', help='Input PDF file(s)')
    parser.add_argument('-o', '--output', required=True, help='Output CSV file')
    parser.add_argument('-v', '--verbose', action='store_true', help='Enable verbose output')
    parser.add_argument('--dump-text', action='store_true', help='Dump raw PDF text to a file for debugging')

    args = parser.parse_args()

    # Dump raw text mode for debugging
    if args.dump_text:
        for pdf_path in args.input:
            path = Path(pdf_path)
            if not path.exists():
                print(f"File not found: {pdf_path}", file=sys.stderr)
                continue

            print(f"Extracting text from: {pdf_path}")
            with pdfplumber.open(pdf_path) as pdf:
                all_text = ""
                for i, page in enumerate(pdf.pages):
                    all_text += f"\n{'='*60}\nPAGE {i+1}\n{'='*60}\n"

                    # Method 1: Standard text extraction
                    page_text = page.extract_text() or ''
                    all_text += f"\n--- STANDARD TEXT ---\n{page_text}\n"

                    # Method 2: Text with layout preservation
                    try:
                        layout_text = page.extract_text(layout=True) or ''
                        if layout_text != page_text:
                            all_text += f"\n--- LAYOUT TEXT ---\n{layout_text}\n"
                    except:
                        pass

                    # Method 3: Extract tables
                    tables = page.extract_tables()
                    if tables:
                        all_text += f"\n--- TABLES ({len(tables)} found) ---\n"
                        for t_idx, table in enumerate(tables):
                            all_text += f"\nTable {t_idx + 1}:\n"
                            for row in table:
                                row_text = ' | '.join(str(cell) if cell else '' for cell in row)
                                all_text += f"  {row_text}\n"

                    # Method 4: Extract all characters/words
                    chars = page.chars
                    if chars:
                        all_text += f"\n--- CHAR COUNT: {len(chars)} ---\n"

                    words = page.extract_words()
                    if words:
                        all_text += f"\n--- WORDS ({len(words)} found) ---\n"
                        word_text = ' '.join(w['text'] for w in words)
                        all_text += f"{word_text}\n"

            dump_file = path.stem + "_raw_text.txt"
            with open(dump_file, 'w') as f:
                f.write(all_text)
            print(f"Raw text saved to: {dump_file}")
            print(f"Total length: {len(all_text)} characters")
        return

    # Parse each PDF
    tax_parser = TurboTaxParser(verbose=args.verbose)
    results = []

    for pdf_path in args.input:
        path = Path(pdf_path)
        if not path.exists():
            print(f"Warning: File not found: {pdf_path}", file=sys.stderr)
            continue

        print(f"Parsing: {pdf_path}")
        try:
            data = tax_parser.parse_pdf(str(path))
            results.append(data.to_dict())
            print(f"  Tax Year: {data.tax_year}")
            print(f"  Filing Status: {data.filing_status}")
            print(f"  AGI: ${float(data.agi):,.2f}")
            print(f"  Total Tax: ${float(data.total_tax):,.2f}")
            print(f"  Effective Rate: {float(data.effective_tax_rate)*100:.2f}%")
        except Exception as e:
            print(f"Error parsing {pdf_path}: {e}", file=sys.stderr)
            if args.verbose:
                import traceback
                traceback.print_exc()

    if not results:
        print("No tax returns were successfully parsed.", file=sys.stderr)
        sys.exit(1)

    # Create DataFrame and save to CSV
    df = pd.DataFrame(results)

    # Reorder columns to match database schema
    column_order = [
        'tax_year', 'filing_status',
        'wages', 'interest_income', 'dividend_income', 'qualified_dividends',
        'capital_gains', 'ira_distributions', 'pension_income', 'social_security',
        'business_income', 'other_income', 'total_income', 'agi',
        'adjustments', 'deduction_type', 'deduction_amount', 'qbi_deduction', 'taxable_income',
        'total_tax', 'federal_withheld', 'estimated_payments', 'refund_amount', 'amount_owed',
        'effective_tax_rate', 'se_income', 'se_tax', 'se_deduction', 'notes'
    ]
    df = df[column_order]

    # Save to CSV
    df.to_csv(args.output, index=False)
    print(f"\nSaved {len(results)} tax return(s) to: {args.output}")


if __name__ == '__main__':
    main()
