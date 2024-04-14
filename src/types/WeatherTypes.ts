export interface Coordinates {
  lon: number;
  lat: number;
}


export interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
    pressure: number;
  };
  weather: {
    id: number; // Add this line to include the id property
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}

export type Data = {
  geoname_id: string;
  name: string;
  ascii_name: string;
  alternate_names: string[] | null;
  feature_class: string;
  feature_code: string;
  country_code: string;
  cou_name_en: string;
  country_code_2: string | null;
  admin1_code: string;
  admin2_code: string | null;
  admin3_code: string | null;
  admin4_code: string | null;
  population: number;
  elevation: number | null;
  dem: number;
  timezone: string;
  modification_date: string;
  label_en: string;
  coordinates: {
    lon: number;
    lat: number;
  };
  records: string[] | null;
};

export interface WeatherData {
  temperature: number;
  humidity: number;
  // Add more properties as needed
}


export type ApiResponse = {
  total_count: number;
  results: Data[];
};


export interface Sorting {
  id: string;
  desc: boolean;
}

export interface QueryFnParams {
  globalFilter?: string;
  sorting?: Sorting[];
  pageParam?: number;
}

export type ActionTypes = 
  | 'FETCH_DATA_REQUEST'
  | 'FETCH_DATA_SUCCESS'
  | 'FETCH_DATA_FAILURE';

// Usage example
export const actionType: ActionTypes = 'FETCH_DATA_REQUEST';