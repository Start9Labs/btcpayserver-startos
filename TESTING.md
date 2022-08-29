# BTCPay Server Embassy Testing 

- Configure with defaults
- Start service
- Launch UI
- Register user
- Create store
- Add Bitcoin wallet
- Log out, ensure you cannot register a new user
- Log back in
- Open Server Settings > Policies > New User Settings - make sure "Disable new user registration on the server" is checked
- in eOS, navigate to Actions > Enable Registrations - complete action
- Navigate back to Settings > Policies > New User Settings - refresh page - make sure "Disable new user registration on the server" is unchecked
- Log out, ensure you can create a new user
- In eOS, navigate to Actions > Reset Admin Password - complete action
- Create an invoice, ensure can pay in BTC/LN, pay
- Setup and test SMTP server emails
- Properties page should render and display no properties