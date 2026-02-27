import puppeteer from "puppeteer";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HANDBOOK_URL = "https://app.solofi.io/handbooks/self-employed-tax-handbook";
const BUCKET = "assets";
const FILE_PATH = "handbooks/self-employed-tax-handbook.pdf";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generatePdf() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log(`Navigating to ${HANDBOOK_URL}...`);
  await page.goto(HANDBOOK_URL, { waitUntil: "networkidle2", timeout: 30000 });

  // Emulate print media so @media print styles apply
  await page.emulateMediaType("print");

  console.log("Generating PDF...");
  const pdfBuffer = await page.pdf({
    format: "Letter",
    margin: { top: "0.75in", bottom: "0.75in", left: "0.75in", right: "0.75in" },
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF generated (${Math.round(pdfBuffer.length / 1024)}KB)`);

  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET);
  if (!bucketExists) {
    console.log(`Creating bucket "${BUCKET}"...`);
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  // Upload to Supabase storage
  console.log("Uploading to Supabase storage...");
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE_PATH, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    process.exit(1);
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(FILE_PATH);
  console.log("\n✅ Done! Public PDF URL:");
  console.log(urlData.publicUrl);
}

generatePdf().catch((err) => {
  console.error(err);
  process.exit(1);
});
