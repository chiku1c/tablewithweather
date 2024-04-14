import {
  type UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_RowVirtualizer,
} from 'material-react-table';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ApiResponse, Data } from '../types/WeatherTypes';


const columns: MRT_ColumnDef<Data>[] = [
  {
    accessorKey: 'name',
    header: 'City Name',
  },
  {
    accessorKey: 'cou_name_en',
    header: 'Country',
  },
  {
    accessorKey: 'timezone',
    header: 'Timezone',
  },
  {
    accessorKey: "country_code",
    header: "Country Code"
  }

];


const Datatable = () => {
  const navigate = useNavigate();

  const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } = useInfiniteQuery<ApiResponse>({
    queryKey: [
      'table-data',
      columnFilters,
      globalFilter,
      sorting,
    ],
    queryFn: async ({ pageParam }) => {
      const url = new URL(
        "/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records",
        "https://public.opendatasoft.com/"
      );
      const queryParams = new URLSearchParams();

      if (globalFilter) {
        queryParams.set('where', `"${encodeURIComponent(globalFilter)}"`);
      } else {
        queryParams.set('limit', `20`);
        queryParams.set('offset', `${20 * 20}`); // adjust offset based on pageParam
        if (sorting && sorting.length > 0) {
          const { id, desc } = sorting[0];
          queryParams.set('order_by', `${id} ${desc ? 'DESC' : 'ASC'}`);
        }
      }

      url.search = queryParams.toString();

      const response = await fetch(url.href);
      const json = await response.json();

      return json;
    },
    initialPageParam: 0,
    getNextPageParam: (_lastGroup, groups) => groups.length,
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.results) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages[0]?.total_count ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount],
  );
  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const table = useMaterialReactTable({
    columns,
    data: flatData,
    globalFilterFn: "contains",
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    manualFiltering: true,
    manualSorting: true,
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        if (event.ctrlKey || event.metaKey) { // Check if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
          window.open(`/weather-details/${row?.original?.name}/${row?.original?.coordinates?.lat}/${row?.original?.coordinates?.lon}`, '_blank');
        } else {
          console.log(event, row?.original?.coordinates);
          navigate(`/weather-details/${row?.original?.name}/${row?.original?.coordinates?.lat}/${row?.original?.coordinates?.lon}`);
        }
      },
      onContextMenu: (event) => {
        event.preventDefault(); // Prevent default right-click behavior
        window.open(`/weather-details/${row?.original?.name}/${row?.original?.coordinates?.lat}/${row?.original?.coordinates?.lon}`, '_blank');
      },
      sx: {
        cursor: 'pointer',
      },
    }),
    muiTableContainerProps: {
      ref: tableContainerRef, //get access to the table container element
      sx: { maxHeight: '500px' }, //give the table a max height
      onScroll: (event: UIEvent<HTMLDivElement>) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement), //add an event listener to the table container element
    },
    muiToolbarAlertBannerProps: isError
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerOptions: { overscan: 4 },
  });

  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const DatatableWithReactQueryProvider = () => (
  <QueryClientProvider client={queryClient}>
    <Datatable />
  </QueryClientProvider>
);

export default DatatableWithReactQueryProvider;
