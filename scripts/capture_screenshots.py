"""Capture repository previews from the running dashboard; requires Playwright.
Run: python scripts/capture_screenshots.py [http://localhost:8000]
"""
from pathlib import Path
import html
import shutil
import sys
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
out = root / 'docs/screenshots'
out.mkdir(parents=True, exist_ok=True)
url = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8000'
with sync_playwright() as p:
    chromium = shutil.which('chromium') or shutil.which('google-chrome')
    options = {'headless': True}
    if chromium:
        options['executable_path'] = chromium
    browser = p.chromium.launch(**options)
    page = browser.new_page(viewport={'width':1440,'height':1500}, device_scale_factor=1)
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(url)
    page.wait_for_selector('#dashboard:not([hidden])')
    page.wait_for_selector('.study-district')
    page.evaluate('document.fonts.ready')
    page.screenshot(path=str(out / 'dashboard-overview.png'))
    page.locator('.geography').screenshot(path=str(out / 'pakistan-district-map.png'))
    page.locator('#tab-education').click()
    page.locator('#panel').screenshot(path=str(out / 'education-analysis.png'))
    page.locator('#tab-labor').click()
    page.set_viewport_size({'width':390,'height':844})
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.screenshot(path=str(out / 'mobile-dashboard.png'))
    # Render an exact excerpt from the supplied log; this is not a Stata UI capture.
    log = (root / 'research/stata/analysis-log.txt').read_text()
    start = log.index('. tabulate employed gender, chi2')
    end = log.index('\n. ', start + 3)
    excerpt = log[start:end].strip()
    preview = browser.new_page(viewport={'width':1050,'height':650},device_scale_factor=1)
    preview.set_content('''<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>body{margin:0;padding:45px;background:#f3f5f8;color:#17243b;font:16px Arial,sans-serif}
main{background:white;border:1px solid #d9e1ec;border-radius:10px;padding:30px}
h1{font-size:25px;margin:8px 0 12px}p{font-size:13px;color:#58677b;line-height:1.7}
small{letter-spacing:1px;font-weight:bold;color:#63508a}pre{background:#f6f8fb;padding:23px;border-radius:5px;font:16px/1.6 monospace;white-space:pre-wrap}footer{font-size:12px;color:#657187}</style></head><body><main>
<small>STATA ANALYTICAL OUTPUT / HISTORICAL LOG</small><h1>Employment status and gender</h1>
<p>Exact excerpt from the supplied readable Stata log. Unweighted respondent counts.</p><pre>'''+html.escape(excerpt)+'''</pre><footer>Rendered log excerpt, not a native Stata screenshot or a newly executed test. Reported 0.000 denotes p &lt; 0.001.</footer></main></body></html>''')
    preview.screenshot(path=str(out / 'stata-output-excerpt.png'))
    assert not errors, errors
    browser.close()
print('Captured five repository previews; map loaded, no JavaScript errors, mobile fits viewport.')
