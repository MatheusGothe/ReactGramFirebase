import './Search.css'

// hooks
import { useSelector,useDispatch} from 'react-redux'

import { useQuery } from '../../hooks/useQuery'




const Search = () => {

  const query = useQuery()
  const search = query.get("q")

  const dispatch = useDispatch()


  return (
    <div>Search {search} </div>
  )
}

export default Search