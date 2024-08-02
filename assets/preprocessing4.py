import pandas as pd

# Load the dataset
file_path = '/home/sina/dev/courses/3/DV/dv-project-2/test/assets/Life_Expectancy_Data.csv'
df = pd.read_csv(file_path)

# Drop rows with missing values in the 'Life expectancy', 'Country', 'GDP', and 'Population' columns
df.dropna(subset=['Life expectancy', 'Country', 'GDP', 'Population', 'Status'], inplace=True)

# Calculate the average life expectancy, GDP, and population for each country
agg_data = df.groupby('Country').agg({
    'Life expectancy': 'mean',
    'GDP': 'mean',
    'Population': 'mean',
    'Status': 'first'  # Assuming status doesn't change over the years for a country
}).reset_index()

# Rename columns for clarity
agg_data.columns = ['Country', 'Average_Life_Expectancy', 'Average_GDP', 'Average_Population', 'Status']

# Save the preprocessed data to a CSV file
preprocessed_file_path = './Preprocessed_Scatter_Plot_Data.csv'
agg_data.to_csv(preprocessed_file_path, index=False)
