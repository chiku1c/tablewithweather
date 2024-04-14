import axios from 'axios';
import {  Data, QueryFnParams } from '../types/WeatherTypes';

export const fetchCities = async (page: number): Promise<{ results: Data[] }> => {
  console.log(page)
  try {
    const response = await axios.get(`/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&offset=${page}`);
    return response?.data?.results; 
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};


export const ServiceQueryFn = async ({ globalFilter, sorting, pageParam }: QueryFnParams) => {
  const url = new URL(
    "/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records",
    "https://public.opendatasoft.com/"
  );
  const queryParams = new URLSearchParams();

  if (globalFilter) {
    queryParams.set('where', globalFilter);
  } else {
    queryParams.set('limit', `20`);
    if (pageParam) {
      queryParams.set('offset', `${pageParam * 20}`); // adjust offset based on pageParam
    }
    if (sorting && sorting.length > 0) {
      const { id, desc } = sorting[0];
      queryParams.set('order_by', `${id} ${desc ? 'DESC' : 'ASC'}`);
    }
  }

  url.search = queryParams.toString();

  const response = await fetch(url.href);
  const json = await response.json();

  return json;
};



