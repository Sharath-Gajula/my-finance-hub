import { useState, useEffect, useCallback, useRef } from 'react';
import { StockData, ChartDataPoint, ApiResponse } from '@/types/widget';
import { generateMockStockData, generateMockChartData, generateMockTableData } from '@/lib/mockData';

export function useStockData(
  symbol: string,
  refreshInterval: number = 30
): ApiResponse<StockData> & { refetch: () => void } {
  const [state, setState] = useState<ApiResponse<StockData>>({
    data: null,
    loading: true,
    error: null,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
      
      // Simulate occasional errors (5% chance)
      if (Math.random() < 0.05) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }
      
      const data = generateMockStockData(symbol);
      setState({
        data,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      }));
    }
  }, [symbol]);
  
  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, refreshInterval, fetchData]);
  
  return { ...state, refetch: fetchData };
}

export function useChartData(
  symbol: string,
  refreshInterval: number = 60,
  points: number = 30
): ApiResponse<ChartDataPoint[]> & { refetch: () => void } {
  const [state, setState] = useState<ApiResponse<ChartDataPoint[]>>({
    data: null,
    loading: true,
    error: null,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 600));
      
      if (Math.random() < 0.05) {
        throw new Error('Failed to load chart data');
      }
      
      const data = generateMockChartData(symbol, points);
      setState({
        data,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch chart data',
      }));
    }
  }, [symbol, points]);
  
  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [symbol, refreshInterval, fetchData]);
  
  return { ...state, refetch: fetchData };
}

export function useTableData(
  refreshInterval: number = 60,
  count: number = 10
): ApiResponse<StockData[]> & { refetch: () => void } {
  const [state, setState] = useState<ApiResponse<StockData[]>>({
    data: null,
    loading: true,
    error: null,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
      
      if (Math.random() < 0.03) {
        throw new Error('Service temporarily unavailable');
      }
      
      const data = generateMockTableData(count);
      setState({
        data,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch table data',
      }));
    }
  }, [count]);
  
  useEffect(() => {
    fetchData();
    
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(fetchData, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, fetchData]);
  
  return { ...state, refetch: fetchData };
}
