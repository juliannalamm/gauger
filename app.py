from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
import pandas as pd

app = Flask(__name__)

# Helper function: Scrape Zillow
def scrape_zillow(url):
    try:
        with sync_playwright() as p:
            # Launch browser
            browser = p.chromium.launch(headless=True)  # Set headless=False for debugging
            page = browser.new_page()

            # Visit the provided Zillow URL
            page.goto(url)

            # Wait for the page to load completely
            page.wait_for_load_state('networkidle')

            # Selectors for price and address
            price_selector = 'div.list-card-price'  # Update based on Zillow's structure
            address_selector = 'address.list-card-addr'  # Update based on Zillow's structure

            # Extract prices and addresses
            prices = page.locator(price_selector).all_inner_texts()
            addresses = page.locator(address_selector).all_inner_texts()

            # Close browser
            browser.close()

            # Return scraped data
            return {'prices': prices, 'addresses': addresses}

    except Exception as e:
        print(f"Error during scraping: {e}")
        return None

# Flask route for scraping Zillow
@app.route('/scrape', methods=['POST'])
def scrape():
    # Get the URL from the request
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    # Call the scrape_zillow function
    result = scrape_zillow(url)
    if not result:
        return jsonify({'error': 'Failed to scrape Zillow. Check the URL or try again later.'}), 500

    # Create a DataFrame (optional, for further processing)
    df = pd.DataFrame({
        'Price': result['prices'],
        'Address': result['addresses']
    })

    # Return the scraped data as JSON
    return jsonify({
        'prices': result['prices'],
        'addresses': result['addresses']
    })

@app.route('/')
def home():
    return "Zillow Scraper API is running! Use POST /scrape with a URL."

if __name__ == '__main__':
    app.run(debug=True)
