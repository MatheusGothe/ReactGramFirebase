import { GetIp } from '../utils/GetIp';

const IpComponent = () => {
  const [serverIp, setServerIp] = useState('');

  useEffect(() => {
    setServerIp(GetIp());
  }, []);

  return <div>{serverIp}</div>;
};

export default IpComponent;

