import store from '@/redux/store';
import '@/styles/globals.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ka-table/style.css';
import { Provider } from 'react-redux';

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
)}

export default App;