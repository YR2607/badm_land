#!/usr/bin/env python3
"""
Test script to check BWF site accessibility and Cloudflare status.
"""
import requests
import cloudscraper
import os
import time

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
}

def test_direct_request(url):
    """Test direct request to URL."""
    print(f"\n--- Testing direct request to {url} ---")
    try:
        response = requests.get(url, headers=HEADERS, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Content length: {len(response.text)}")
        
        # Check for Cloudflare blocks
        content_lower = response.text.lower()
        if 'cloudflare' in content_lower and 'blocked' in content_lower:
            print("❌ BLOCKED by Cloudflare")
            return False
        elif 'attention required' in content_lower:
            print("❌ Cloudflare challenge page")
            return False
        elif '<title>' in content_lower and 'bwf' in content_lower:
            print("✅ Successfully accessed BWF content")
            return True
        else:
            print("⚠️ Unknown response content")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_cloudscraper(url):
    """Test cloudscraper request to URL."""
    print(f"\n--- Testing cloudscraper to {url} ---")
    try:
        scraper = cloudscraper.create_scraper(
            browser={
                'browser': 'chrome',
                'platform': 'windows',
                'desktop': True
            }
        )
        response = scraper.get(url, headers=HEADERS, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Content length: {len(response.text)}")
        
        # Check for Cloudflare blocks
        content_lower = response.text.lower()
        if 'cloudflare' in content_lower and 'blocked' in content_lower:
            print("❌ BLOCKED by Cloudflare")
            return False
        elif 'attention required' in content_lower:
            print("❌ Cloudflare challenge page")
            return False
        elif '<title>' in content_lower and 'bwf' in content_lower:
            print("✅ Successfully accessed BWF content")
            return True
        else:
            print("⚠️ Unknown response content")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_proxy_services(url):
    """Test proxy services if keys are available."""
    scraperapi_key = os.getenv('SCRAPERAPI_KEY')
    scrapingbee_key = os.getenv('SCRAPINGBEE_KEY')
    
    if scraperapi_key:
        print(f"\n--- Testing ScraperAPI proxy to {url} ---")
        try:
            proxy_url = f"https://api.scraperapi.com?api_key={scraperapi_key}&url={requests.utils.quote(url, safe='')}&country=de&render=true"
            response = requests.get(proxy_url, headers=HEADERS, timeout=60)
            print(f"Status: {response.status_code}")
            print(f"Content length: {len(response.text)}")
            
            content_lower = response.text.lower()
            if '<title>' in content_lower and 'bwf' in content_lower:
                print("✅ ScraperAPI successfully accessed BWF content")
                return True
            else:
                print("⚠️ ScraperAPI returned unexpected content")
                return False
        except Exception as e:
            print(f"❌ ScraperAPI Error: {e}")
    
    if scrapingbee_key:
        print(f"\n--- Testing ScrapingBee proxy to {url} ---")
        try:
            proxy_url = f"https://app.scrapingbee.com/api/v1/?api_key={scrapingbee_key}&url={requests.utils.quote(url, safe='')}&render_js=true"
            response = requests.get(proxy_url, headers=HEADERS, timeout=60)
            print(f"Status: {response.status_code}")
            print(f"Content length: {len(response.text)}")
            
            content_lower = response.text.lower()
            if '<title>' in content_lower and 'bwf' in content_lower:
                print("✅ ScrapingBee successfully accessed BWF content")
                return True
            else:
                print("⚠️ ScrapingBee returned unexpected content")
                return False
        except Exception as e:
            print(f"❌ ScrapingBee Error: {e}")
    
    if not scraperapi_key and not scrapingbee_key:
        print("\n--- No proxy API keys available ---")
    
    return False

def main():
    print("BWF Site Accessibility Test")
    print("=" * 50)
    
    test_urls = [
        'https://bwfbadminton.com/news/',
        'https://bwfbadminton.com/',
        'https://bwfworldtour.bwfbadminton.com/news/',
    ]
    
    results = {}
    
    for url in test_urls:
        print(f"\n{'=' * 60}")
        print(f"Testing: {url}")
        print('=' * 60)
        
        # Test direct access
        direct_success = test_direct_request(url)
        
        # Test cloudscraper
        cloudscraper_success = test_cloudscraper(url)
        
        # Test proxy services
        proxy_success = test_proxy_services(url)
        
        results[url] = {
            'direct': direct_success,
            'cloudscraper': cloudscraper_success,
            'proxy': proxy_success
        }
        
        # Add delay between requests
        time.sleep(2)
    
    # Summary
    print(f"\n{'=' * 60}")
    print("SUMMARY")
    print('=' * 60)
    
    for url, result in results.items():
        print(f"\n{url}:")
        print(f"  Direct:      {'✅' if result['direct'] else '❌'}")
        print(f"  Cloudscraper: {'✅' if result['cloudscraper'] else '❌'}")
        print(f"  Proxy:       {'✅' if result['proxy'] else '❌'}")
    
    # Recommendations
    print(f"\n{'=' * 60}")
    print("RECOMMENDATIONS")
    print('=' * 60)
    
    any_direct = any(r['direct'] for r in results.values())
    any_cloudscraper = any(r['cloudscraper'] for r in results.values())
    any_proxy = any(r['proxy'] for r in results.values())
    
    if any_proxy:
        print("✅ Proxy services work - use them for reliable access")
    elif any_cloudscraper:
        print("⚠️ Cloudscraper works - use as fallback")
    elif any_direct:
        print("⚠️ Direct access works - but may be unreliable")
    else:
        print("❌ All methods failed - BWF sites may be completely blocked")
        print("   Consider using alternative news sources or RSS feeds")

if __name__ == '__main__':
    main()
