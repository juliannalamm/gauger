from playwright.sync_api import sync_playwright

def scrape_zillow_price(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        try:
            page.goto(url)

            
            # Selectors
            address_selector = 'h1[class="Text-c11n-8-100-1__sc-aiai24-0 jbRdkh"]' #address
            price_selector = 'span[data-testid="price"]'  # Current price
            price_history_selector = 'td[data-testid="price-money-cell"]'  # Price history
            pricedate_history_selector = 'span[data-testid="date-info"]' #Price date history
            # pricecard_selector = 'span[data-test = "property-card-price"]' #list of prices from mainpage view 

            page.wait_for_selector(price_selector, timeout=60000)
            page.wait_for_selector(price_history_selector, timeout=60000)
            page.wait_for_selector(pricedate_history_selector, timeout=60000)
            page.wait_for_selector(address_selector, timeout=60000)
            # page.wait_for_selector(pricecard_selector, timeout=1000000)

            # Extract address 
            address_element = page.locator(address_selector)
            if address_element.count() > 0: 
                address_element = address_element.first.inner_text()
                print(f"Address: {address_element} ")
            else: 
                address_element = None
                print("Address not found")


            # Extract current price
            price_element = page.locator(price_selector)
            if price_element.count() > 0:
                current_price = price_element.first.inner_text()
                print(f"Current Price: {current_price}")
            else:
                current_price = None
                print("Current Price not found.")
            
            # Extract price history
            price_history_element = page.locator(price_history_selector)
            if price_history_element.count() > 0:
                price_history = price_history_element.all_inner_texts()
                print(f"Price History: {price_history}")
            else:
                price_history = None
                print("Price History not found.")
            
            # Extract price date history
            pricedate_history_element = page.locator(pricedate_history_selector)
            if pricedate_history_element.count() > 0:
                pricedate_history = pricedate_history_element.all_inner_texts()
                print(f"Price Date History: {pricedate_history}")
            else:
                pricedate_history = None
                print("Price Date History not found.")

            # #extract list of prices 
            # pricecard_element = page.locator(pricecard_selector)
            # if pricecard_element.count() > 0: 
            #     pricecard = pricecard_element.all_inner_texts()
            #     print(f'all price: {pricecard}')
            # else: 
            #     pricecard = None
            #     print("No prices found")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

# Test the function
scrape_zillow_price(
    url="https://www.zillow.com/apartments/los-angeles-ca/zen-hollywood/CgJ3Xz/")


# price_history tag td[data-testid="price-money-cell"]').innerText
