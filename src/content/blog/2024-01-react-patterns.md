# Advanced React Patterns for 2024

*Published: January 15, 2024*

React has evolved significantly, and with it, the patterns we use to build maintainable applications. Let's explore some advanced patterns that will make your React code more robust and scalable.

## 1. Compound Components Pattern

The compound component pattern allows you to create flexible and reusable components that work together.

```jsx
const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.List = ({ children }) => (
  <div className="tabs-list">{children}</div>
);

Tabs.Tab = ({ value, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button 
      className={activeTab === value ? 'active' : ''}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
};

// Usage
<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Tab value="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab value="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

## 2. Custom Hooks for Business Logic

Extract complex logic into custom hooks for better reusability and testing.

```jsx
const useAsyncData = (fetchFn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchFn();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
};
```

## 3. Error Boundaries with Hooks

Create robust error handling with modern error boundaries.

```jsx
const useErrorBoundary = () => {
  const [error, setError] = useState(null);
  
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  const captureError = useCallback((error, errorInfo) => {
    setError({ error, errorInfo });
    // Log to external service
    console.error('Error caught by boundary:', error, errorInfo);
  }, []);
  
  return { error, resetError, captureError };
};
```

## 4. Render Props with TypeScript

Type-safe render props for maximum flexibility.

```tsx
interface DataFetcherProps<T> {
  url: string;
  render: (state: {
    data: T | null;
    loading: boolean;
    error: Error | null;
  }) => React.ReactNode;
}

function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const { data, loading, error } = useAsyncData<T>(() => fetch(url).then(r => r.json()));
  
  return <>{render({ data, loading, error })}</>;
}
```

## Key Takeaways

1. **Compound Components** - Great for flexible, composable UI
2. **Custom Hooks** - Extract and reuse stateful logic
3. **Error Boundaries** - Handle errors gracefully
4. **Render Props** - Maximum flexibility with type safety

These patterns will help you write more maintainable React applications in 2024 and beyond.

---