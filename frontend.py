import streamlit as st
import requests

# Point this to your live Render API
API_URL = "https://naijapay-api.onrender.com/transfer/"

# 1. Design the Web Page
st.set_page_config(page_title="NaijaPay UI", page_icon="💸")
st.title("💸 NaijaPay Transfer Portal")
st.write("Send money securely using our AI-powered backend.")

st.divider()

# 2. Create the Input Forms
sender = st.text_input("Your Account ID", value="user_001")
receiver = st.text_input("Receiver Account ID", placeholder="e.g., merchant_99")
amount = st.number_input("Amount to Send (₦)", min_value=100.0, step=100.0)

# 3. Create the Transfer Button
if st.button("Send Money", type="primary"):
    
    if not receiver:
        st.warning("Please enter a receiver ID.")
    else:
        # Show a loading spinner while waiting for the backend
        with st.spinner("Processing transaction & running AI security check..."):
            
            # Package the exact data your API expects
            payload = {
                "sender_id": sender,
                "receiver_id": receiver,
                "amount": amount,
                "channel": "Web App",
                "hour": 14,       # Standard daytime hour
                "velocity": 1     # Normal velocity
            }
            
            try:
                # Send the data to your live Render server
                response = requests.post(API_URL, json=payload)
                data = response.json()
                
                # Check if the backend gave a thumbs up
                if response.status_code == 200:
                    st.success("✅ Transaction Successful!")
                    st.info(f"**Receipt:** {data['gateway_receipt']}")
                    st.write(data['message'])
                    st.balloons() # Add a little celebration animation!
                
                # Catch AI Fraud blocks or Bank timeouts (400 or 502 errors)
                else:
                    st.error("🚨 Transaction Failed")
                    st.write(f"**Reason:** {data['detail']}")
                    
            except Exception as e:
                st.error("Network Error: Could not connect to the API. Is your Render server awake?")