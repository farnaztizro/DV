import pandas as pd

# Load the dataset
file_path = "assets/Life_Expectancy_Data.csv"
df = pd.read_csv(file_path)

# Drop rows with missing values in the 'Life expectancy', 'Country', 'GDP', 'Population' columns
df.dropna(subset=['Life expectancy', 'Country', 'GDP', 'Population'], inplace=True)

# Calculate the average life expectancy, GDP, and population for each country
agg_data = df.groupby('Country').agg({
    'Life expectancy': 'mean',
    'GDP': 'mean',
    'Population': 'mean'
}).reset_index()

# Select a few countries for the grouped bar chart
selected_countries = agg_data[agg_data['Country'].isin(['United States', 'China', 'India', 'Japan', 'Germany'])]

# Normalize the data for better visualization in the grouped bar chart
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
normalized_data = scaler.fit_transform(selected_countries[['Life expectancy', 'GDP', 'Population']])
normalized_df = pd.DataFrame(normalized_data, columns=['Life expectancy', 'GDP', 'Population'])
normalized_df['Country'] = selected_countries['Country'].values

# Save the preprocessed data to a CSV file
preprocessed_file_path = './Preprocessed_Grouped_Bar_Chart_Normalized_Data.csv'
normalized_df.to_csv(preprocessed_file_path, index=False)
