
// 10-days-of-react-hooks

const getOnLineStatus = () =>
	  typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
	    ? navigator.onLine
	    : true;

const isDOMavailable = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);


export default {
	useClickInside: (ref, callback) => {
	  const handleClick = e => {
	    if (ref.current && ref.current.contains(e.target)) {
	      callback();
	    }
	  };
	  React.useEffect(() => {
	    document.addEventListener('click', handleClick);
	    return () => {
	      document.removeEventListener('click', handleClick);
	    };
	  });
	},
	useClickOutside : (ref, callback) => {
	  const handleClick = e => {
	    if (ref.current && !ref.current.contains(e.target)) {
	      callback();
	    }
	  };
	  React.useEffect(() => {
	    document.addEventListener('click', handleClick);
	    return () => {
	      document.removeEventListener('click', handleClick);
	    };
	  });
	},
	useFetch: (url, options) => {
	  const [response, setResponse] = React.useState(null);
	  const [error, setError] = React.useState(null);

	  React.useEffect(() => {
	    const fetchData = async () => {
	      try {
	        const res = await fetch(url, options);
	        const json = await res.json();
	        setResponse(json);
	      } catch (error) {
	        setError(error);
	      }
	    };
	    fetchData();
	  }, []);

	  return { response, error };
	},
	useNavigatorOnLine: () => {
	  const [status, setStatus] = React.useState(getOnLineStatus());

	  const setOnline = () => setStatus(true);
	  const setOffline = () => setStatus(false);

	  React.useEffect(() => {
	    window.addEventListener("online", setOnline);
	    window.addEventListener("offline", setOffline);

	    return () => {
	      window.removeEventListener("online", setOnline);
	      window.removeEventListener("offline", setOffline);
	    };
	  }, []);

	  return status;
	},
	useSSR = (callback, delay) => {
	  const [inBrowser, setInBrowser] = React.useState(isDOMavailable);

	  React.useEffect(() => {
	    setInBrowser(isDOMavailable);
	    return () => {
	      setInBrowser(false);
	    }
	  }, []);

	  const useSSRObject = React.useMemo(() => ({
	    isBrowser: inBrowser,
	    isServer: !inBrowser,
	    canUseWorkers: typeof Worker !== 'undefined',
	    canUseEventListeners: inBrowser && !!window.addEventListener,
	    canUseViewport: inBrowser && !!window.screen
	  }), [inBrowser]);

	  return React.useMemo(() => Object.assign(Object.values(useSSRObject), useSSRObject), [inBrowser]);
	},
	useTimeout: (callback, delay) => {
	  const savedCallback = React.useRef();

	  React.useEffect(() => {
	    savedCallback.current = callback;
	  }, [callback]);

	  React.useEffect(() => {
	    function tick() {
	      savedCallback.current();
	    }
	    if (delay !== null) {
	      let id = setTimeout(tick, delay);
	      return () => clearTimeout(id);
	    }
	  }, [delay]);
	}
}