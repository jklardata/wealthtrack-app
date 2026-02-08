# TurboTax PDF Parser

## Overview

This directory contains the TurboTax PDF parser that extracts tax return data from TurboTax PDF files.

## Server Deployment

For the web-based PDF upload feature (`/api/tax-returns/upload-pdf`) to work, the server needs:

### Python 3 Installation

```bash
# Check if Python 3 is installed
python3 --version
```

### Required Python Packages

```bash
pip install pdfplumber pandas
```

Or using pip3:

```bash
pip3 install pdfplumber pandas
```

## Local Usage

Users can also run the parser locally on their computer for privacy:

### Install Dependencies

```bash
pip install pdfplumber pandas
```

### Parse TurboTax PDF

```bash
# Single file
python3 turbotax_parser.py 2023_TaxReturn.pdf -o tax_data.csv

# Multiple years
python3 turbotax_parser.py 2022.pdf 2023.pdf 2024.pdf -o all_returns.csv

# Verbose output
python3 turbotax_parser.py return.pdf -o output.csv -v

# Dump raw text for debugging
python3 turbotax_parser.py return.pdf -o output.csv --dump-text
```

### Review and Upload

1. Open `tax_data.csv` to verify it contains only financial data
2. Upload via Settings page > Tax Returns > Upload CSV (Advanced)

## Supported Fields

The parser extracts all fields matching the `tax_returns` database schema:

- **Income**: Wages, interest, dividends, capital gains, IRA distributions, pensions, Social Security, business income
- **Deductions**: Standard/itemized deductions, QBI deduction
- **Tax**: Total tax, withholding, estimated payments, refund/owed
- **Self-Employment**: SE income, SE tax, SE deduction
- **Metadata**: Tax year, filing status, effective tax rate

## Privacy

- **Web Upload**: PDF is temporarily stored on server, parsed, then immediately deleted
- **Local Parsing**: PDF never leaves your computer, only the CSV is uploaded
- **Data Extracted**: Only financial figures, no PII (SSN, addresses, names, etc.)

## Troubleshooting

### PDF Parsing Fails

If the web upload fails, try:

1. Check if PDF is from TurboTax (other tax software not supported yet)
2. Ensure PDF is not encrypted/password-protected
3. Try running locally with `--dump-text` flag to see raw extraction
4. File an issue with the error message

### Missing Dependencies (Server)

If you see "pdfplumber not installed" error:

```bash
# Install on server
pip3 install pdfplumber pandas

# Verify installation
python3 -c "import pdfplumber; import pandas; print('OK')"
```

## Development

### Test Locally

```bash
# Run parser on sample PDF
python3 turbotax_parser.py test_return.pdf -o test.csv -v

# Check output
cat test.csv
```

### Add New Field Extraction

1. Add field to `TaxReturnData` dataclass
2. Add parsing logic in appropriate `_parse_*` method
3. Test with sample PDFs
4. Update column order in `main()`
