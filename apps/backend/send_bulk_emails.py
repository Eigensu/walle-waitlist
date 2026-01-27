import asyncio
import csv
import sys
import os
import time

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.getcwd())

from app.services.email_service import send_success_email

CSV_FILE = "players-2026-01-27.csv"

async def process_bulk_emails():
    # Check if file exists
    if not os.path.exists(CSV_FILE):
        print(f"❌ File not found: {CSV_FILE}")
        return

    print(f"📂 Reading CSV file: {CSV_FILE}...")
    
    count = 0
    success_count = 0
    fail_count = 0
    skipped_count = 0
    
    with open(CSV_FILE, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        # Convert to list to get total count
        rows = list(reader)
        total_rows = len(rows)
        print(f"📊 Found {total_rows} rows. Filtering for 'PAID' users...")

        for row in rows:
            # Check criteria: Registration Status OR Payment Status
            reg_status = row.get("Registration Status", "").upper()
            pay_status = row.get("Payment Status", "").upper()
            
            if reg_status == "PAID" or pay_status == "CAPTURED":
                recipient_email = row.get("Email")
                first_name = row.get("First Name", "")
                last_name = row.get("Last Name", "")
                player_id = row.get("ID")
                
                # Assume 12500 per player if not in CSV (it isn't), or logic from app
                # The app usually calculates this. We'll use the standard amount.
                amount_inr = 15000 
                
                full_name = f"{first_name} {last_name}".strip()
                
                print(f"[{count+1}/{total_rows}] 📤 Sending to {full_name} ({recipient_email})...")
                
                try:
                    is_sent = await send_success_email(
                        to_email=recipient_email,
                        name=full_name,
                        player_id=player_id,
                        amount=amount_inr
                    )
                    
                    if is_sent:
                        print(f"   ✅ Sent!")
                        success_count += 1
                    else:
                        print(f"   ❌ Failed to send.")
                        fail_count += 1
                        
                    # Rate limiting to be safe with Gmail
                    await asyncio.sleep(2) 
                    
                except Exception as e:
                    print(f"   ❌ Exception: {e}")
                    fail_count += 1
            else:
                # print(f"[{count+1}/{total_rows}] ⏭️  Skipping {row.get('First Name')} (Status: {reg_status}/{pay_status})")
                skipped_count += 1
                
            count += 1

    print("\n" + "="*50)
    print("🏁 Bulk Email Process Completed")
    print("="*50)
    print(f"✅ Successfully Sent: {success_count}")
    print(f"❌ Failed:            {fail_count}")
    print(f"⏭️  Skipped:           {skipped_count}")
    print(f"📊 Total Processed:   {total_rows}")

if __name__ == "__main__":
    asyncio.run(process_bulk_emails())
