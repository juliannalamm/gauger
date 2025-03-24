from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from playwright_stealth import stealth_sync


def scrape_zillow_price(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        stealth_sync(page)

        try:
            print("Navigating to URL...")
            page.goto(url)

            # Wait for specific content to load
            page.wait_for_selector('span[data-testid="price"]', timeout=60000)

            # Get page content and parse with BeautifulSoup
            html_content = page.content()
            soup = BeautifulSoup(html_content, 'html.parser')

            # Define selectors
            address_selector = 'h1[class="Text-c11n-8-100-1__sc-aiai24-0 jbRdkh"]'  # Address
            price_selector = 'span[data-testid="price"]'  # Current price
            price_history_selector = 'td[data-testid="price-money-cell"]'  # Price history
            pricedate_history_selector = 'span[data-testid="date-info"]'  # Price date history

            # Extract Address
            address_element = soup.select_one(address_selector)
            address = address_element.text.strip() if address_element else "Address not found"
            print(f"Address: {address}")

            # Extract Current Price
            price_element = soup.select_one(price_selector)
            current_price = price_element.text.strip() if price_element else "Price not found"
            print(f"Current Price: {current_price}")

            # Extract Price History
            price_history_elements = soup.select(price_history_selector)
            price_history = [element.text.strip() for element in price_history_elements]
            print(f"Price History: {price_history if price_history else 'Price history not found'}")

            # Extract Price Date History
            pricedate_history_elements = soup.select(pricedate_history_selector)
            pricedate_history = [element.text.strip() for element in pricedate_history_elements]
            print(f"Price Date History: {pricedate_history if pricedate_history else 'Price date history not found'}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
            print("Browser closed.")


# Test the function
scrape_zillow_price(
    url="https://www.zillow.com/homedetails/11724-Culver-Blvd-1-Los-Angeles-CA-90066/325799088_zpid/"
)
