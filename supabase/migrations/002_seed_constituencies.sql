-- ══════════════════════════════════════════════════════════════
-- Seed: Indian States, UTs, and Sample Constituencies
-- ══════════════════════════════════════════════════════════════

-- States (28) + Union Territories (8) with sample constituencies
INSERT INTO constituencies (name, type, state, district, code) VALUES
-- Andhra Pradesh (25 Lok Sabha)
('Srikakulam', 'parliamentary', 'Andhra Pradesh', 'Srikakulam', 'AP-01'),
('Rajam (Srikakulam)', 'parliamentary', 'Andhra Pradesh', 'Srikakulam', 'AP-02'),
('Vizianagaram', 'parliamentary', 'Andhra Pradesh', 'Vizianagaram', 'AP-03'),
('Visakhapatnam', 'parliamentary', 'Andhra Pradesh', 'Visakhapatnam', 'AP-04'),
('Anakapalli', 'parliamentary', 'Andhra Pradesh', 'Anakapalli', 'AP-05'),
-- Arunachal Pradesh
('Arunachal West', 'parliamentary', 'Arunachal Pradesh', 'Itanagar', 'AR-01'),
('Arunachal East', 'parliamentary', 'Arunachal Pradesh', 'Pasighat', 'AR-02'),
-- Assam (14 Lok Sabha)
('Karimganj', 'parliamentary', 'Assam', 'Karimganj', 'AS-01'),
('Silchar', 'parliamentary', 'Assam', 'Cachar', 'AS-02'),
('Dhubri', 'parliamentary', 'Assam', 'Dhubri', 'AS-03'),
('Guwahati', 'parliamentary', 'Assam', 'Kamrup', 'AS-04'),
-- Bihar (40 Lok Sabha)
('Patna Sahib', 'parliamentary', 'Bihar', 'Patna', 'BR-01'),
('Pataliputra', 'parliamentary', 'Bihar', 'Patna', 'BR-02'),
('Madhubani', 'parliamentary', 'Bihar', 'Madhubani', 'BR-03'),
('Darbhanga', 'parliamentary', 'Bihar', 'Darbhanga', 'BR-04'),
-- Chhattisgarh (11 Lok Sabha)
('Raipur', 'parliamentary', 'Chhattisgarh', 'Raipur', 'CG-01'),
('Durg', 'parliamentary', 'Chhattisgarh', 'Durg', 'CG-02'),
-- Goa
('North Goa', 'parliamentary', 'Goa', 'North Goa', 'GA-01'),
('South Goa', 'parliamentary', 'Goa', 'South Goa', 'GA-02'),
-- Gujarat (26 Lok Sabha)
('Ahmedabad East', 'parliamentary', 'Gujarat', 'Ahmedabad', 'GJ-01'),
('Ahmedabad West', 'parliamentary', 'Gujarat', 'Ahmedabad', 'GJ-02'),
('Surat', 'parliamentary', 'Gujarat', 'Surat', 'GJ-03'),
('Vadodara', 'parliamentary', 'Gujarat', 'Vadodara', 'GJ-04'),
-- Haryana (10 Lok Sabha)
('Gurugram', 'parliamentary', 'Haryana', 'Gurugram', 'HR-01'),
('Faridabad', 'parliamentary', 'Haryana', 'Faridabad', 'HR-02'),
-- Himachal Pradesh
('Shimla', 'parliamentary', 'Himachal Pradesh', 'Shimla', 'HP-01'),
('Mandi', 'parliamentary', 'Himachal Pradesh', 'Mandi', 'HP-02'),
-- Jharkhand (14 Lok Sabha)
('Ranchi', 'parliamentary', 'Jharkhand', 'Ranchi', 'JH-01'),
('Jamshedpur', 'parliamentary', 'Jharkhand', 'East Singhbhum', 'JH-02'),
-- Karnataka (28 Lok Sabha)
('Bangalore South', 'parliamentary', 'Karnataka', 'Bangalore', 'KA-01'),
('Bangalore North', 'parliamentary', 'Karnataka', 'Bangalore', 'KA-02'),
('Bangalore Central', 'parliamentary', 'Karnataka', 'Bangalore', 'KA-03'),
('Mysore', 'parliamentary', 'Karnataka', 'Mysore', 'KA-04'),
-- Kerala (20 Lok Sabha)
('Thiruvananthapuram', 'parliamentary', 'Kerala', 'Thiruvananthapuram', 'KL-01'),
('Kochi', 'parliamentary', 'Kerala', 'Ernakulam', 'KL-02'),
('Kozhikode', 'parliamentary', 'Kerala', 'Kozhikode', 'KL-03'),
-- Madhya Pradesh (29 Lok Sabha)
('Bhopal', 'parliamentary', 'Madhya Pradesh', 'Bhopal', 'MP-01'),
('Indore', 'parliamentary', 'Madhya Pradesh', 'Indore', 'MP-02'),
-- Maharashtra (48 Lok Sabha)
('Mumbai North', 'parliamentary', 'Maharashtra', 'Mumbai', 'MH-01'),
('Mumbai South', 'parliamentary', 'Maharashtra', 'Mumbai', 'MH-02'),
('Mumbai North-East', 'parliamentary', 'Maharashtra', 'Mumbai', 'MH-03'),
('Pune', 'parliamentary', 'Maharashtra', 'Pune', 'MH-04'),
('Nagpur', 'parliamentary', 'Maharashtra', 'Nagpur', 'MH-05'),
-- Manipur
('Inner Manipur', 'parliamentary', 'Manipur', 'Imphal', 'MN-01'),
('Outer Manipur', 'parliamentary', 'Manipur', 'Tamenglong', 'MN-02'),
-- Meghalaya
('Shillong', 'parliamentary', 'Meghalaya', 'East Khasi Hills', 'ML-01'),
('Tura', 'parliamentary', 'Meghalaya', 'West Garo Hills', 'ML-02'),
-- Mizoram
('Mizoram', 'parliamentary', 'Mizoram', 'Aizawl', 'MZ-01'),
-- Nagaland
('Nagaland', 'parliamentary', 'Nagaland', 'Kohima', 'NL-01'),
-- Odisha (21 Lok Sabha)
('Bhubaneswar', 'parliamentary', 'Odisha', 'Khordha', 'OD-01'),
('Cuttack', 'parliamentary', 'Odisha', 'Cuttack', 'OD-02'),
-- Punjab (13 Lok Sabha)
('Amritsar', 'parliamentary', 'Punjab', 'Amritsar', 'PB-01'),
('Ludhiana', 'parliamentary', 'Punjab', 'Ludhiana', 'PB-02'),
('Chandigarh', 'parliamentary', 'Punjab', 'Chandigarh', 'PB-03'),
-- Rajasthan (25 Lok Sabha)
('Jaipur', 'parliamentary', 'Rajasthan', 'Jaipur', 'RJ-01'),
('Jodhpur', 'parliamentary', 'Rajasthan', 'Jodhpur', 'RJ-02'),
-- Sikkim
('Sikkim', 'parliamentary', 'Sikkim', 'Gangtok', 'SK-01'),
-- Tamil Nadu (39 Lok Sabha)
('Chennai North', 'parliamentary', 'Tamil Nadu', 'Chennai', 'TN-01'),
('Chennai South', 'parliamentary', 'Tamil Nadu', 'Chennai', 'TN-02'),
('Chennai Central', 'parliamentary', 'Tamil Nadu', 'Chennai', 'TN-03'),
('Coimbatore', 'parliamentary', 'Tamil Nadu', 'Coimbatore', 'TN-04'),
('Madurai', 'parliamentary', 'Tamil Nadu', 'Madurai', 'TN-05'),
-- Telangana (17 Lok Sabha)
('Hyderabad', 'parliamentary', 'Telangana', 'Hyderabad', 'TS-01'),
('Secunderabad', 'parliamentary', 'Telangana', 'Hyderabad', 'TS-02'),
-- Tripura
('Tripura West', 'parliamentary', 'Tripura', 'West Tripura', 'TR-01'),
('Tripura East', 'parliamentary', 'Tripura', 'Dhalai', 'TR-02'),
-- Uttar Pradesh (80 Lok Sabha)
('Lucknow', 'parliamentary', 'Uttar Pradesh', 'Lucknow', 'UP-01'),
('Varanasi', 'parliamentary', 'Uttar Pradesh', 'Varanasi', 'UP-02'),
('Prayagraj', 'parliamentary', 'Uttar Pradesh', 'Prayagraj', 'UP-03'),
('Kanpur', 'parliamentary', 'Uttar Pradesh', 'Kanpur', 'UP-04'),
('Noida', 'parliamentary', 'Uttar Pradesh', 'Gautam Buddha Nagar', 'UP-05'),
-- Uttarakhand
('Dehradun', 'parliamentary', 'Uttarakhand', 'Dehradun', 'UK-01'),
('Haridwar', 'parliamentary', 'Uttarakhand', 'Haridwar', 'UK-02'),
-- West Bengal (42 Lok Sabha)
('Kolkata North', 'parliamentary', 'West Bengal', 'Kolkata', 'WB-01'),
('Kolkata South', 'parliamentary', 'West Bengal', 'Kolkata', 'WB-02'),
('Howrah', 'parliamentary', 'West Bengal', 'Howrah', 'WB-03'),
-- Union Territories
('Andaman & Nicobar', 'parliamentary', 'Andaman and Nicobar Islands', 'South Andaman', 'AN-01'),
('Chandigarh', 'parliamentary', 'Chandigarh', 'Chandigarh', 'CH-01'),
('Dadra & Nagar Haveli', 'parliamentary', 'Dadra and Nagar Haveli and Daman and Diu', 'Dadra and Nagar Haveli', 'DD-01'),
('Daman and Diu', 'parliamentary', 'Dadra and Nagar Haveli and Daman and Diu', 'Daman', 'DD-02'),
('New Delhi', 'parliamentary', 'Delhi', 'New Delhi', 'DL-01'),
('Chandni Chowk', 'parliamentary', 'Delhi', 'Central Delhi', 'DL-02'),
('South Delhi', 'parliamentary', 'Delhi', 'South Delhi', 'DL-03'),
('East Delhi', 'parliamentary', 'Delhi', 'East Delhi', 'DL-04'),
('Lakshadweep', 'parliamentary', 'Lakshadweep', 'Lakshadweep', 'LD-01'),
('Puducherry', 'parliamentary', 'Puducherry', 'Puducherry', 'PY-01'),
('Jammu', 'parliamentary', 'Jammu and Kashmir', 'Jammu', 'JK-01'),
('Srinagar', 'parliamentary', 'Jammu and Kashmir', 'Srinagar', 'JK-02'),
('Ladakh', 'parliamentary', 'Ladakh', 'Leh', 'LA-01')
ON CONFLICT (code) DO NOTHING;
