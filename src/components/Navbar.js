import "./Navbar.css";

// Components
import { NavLink, Link } from "react-router-dom";
import {
  BsSearch,
  BsHouseDoorFill,
  BsFillPersonFill,
  BsFillCameraFill,
  BsPlusCircle,
  BsPlusCircleFill,
} from "react-icons/bs";

import {CiCirclePlus} from 'react-icons/ci'
import {Animated} from 'react-animated-css'
import {auth} from '../lib/firebase'




// Hooks
import { useNavigate } from "react-router-dom";

// Redux

import { useState,useEffect, useContext } from "react";

import { useRef } from "react";


import { GlobalContext, GlobalDispatchContext } from '../state/context/GlobalContext'
import { logout } from "../slices/authSlice";


const Navbar = ({showNavbar}) => {

  const dispatch = useContext(GlobalDispatchContext)

  const {user} = useContext(GlobalContext)

  const searchFormRef = useRef();
  const usersSearchRef = useRef();

  const [query,setQuery] = useState('')
  let search = query
  const navigate = useNavigate()
  
  const userAuth = auth.currentUser



   const handleStorieValue = () => {
    
   }

  const handleLogout = async() => {
  
    try {
      
      await logout()
      dispatch({
        type:'SET_USER',
        payload: {
          user: null
        }
      })
      
      navigate('/login')
    } catch (error) {
      
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
  }

  return (
    <>
    <nav id={'nav'} >
      <Link to="/">ReactGram</Link>
        <form id="search-form" onSubmit={handleSearch} ref={searchFormRef} >
        <BsSearch className="bs-search" onClick={handleSearch} />
        <input
          type="text"
          className="inputBusca"
          placeholder="Pesquisar"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
           disabled={!auth}
        />
      </form>
      {query && (
  <div className="users-search" ref={usersSearchRef}>
    {/* {users && (
      users.map((user) => (
        <div
          className="div-search"
          onClick={() => {
            setQuery('');
            navigate(`/users/${user._id}`);
          }}
          key={user._id}
        >
          <img
            className="search-img"
            src={`${uploads}/users/${user.profileImage}`}
            alt=""
          />
          <p style={{ color: "black" }}>{user.name} </p>
        </div>
      )) */}
    {/* )} */}
    {/* {users.length < 1 && (
      <>
        <p style={{ color:"black"}} >Nenhum usuário encontrado</p>
      </>
    ) } */}
  </div>
)}
     <ul id="nav-links">
  {userAuth ? (
    <>
      <li>
        <NavLink to='/postStorie'>
          <BsPlusCircleFill />
        </NavLink>
      </li>
      <li>
        <NavLink to="/">
          <BsHouseDoorFill />
        </NavLink>
      </li>
      {userAuth && (
        <li>
          <NavLink to={`/users/${userAuth.uid}`}>
            <BsFillCameraFill />
          </NavLink>
        </li>
      )}
      <li>
        <NavLink to="/profile">
          <BsFillPersonFill />
        </NavLink>
      </li>
      <li>
        <span onClick={handleLogout}>Sair</span>
      </li>
    </>
  ) : (
    <>
      <li>
        <NavLink to="/login">Entrar</NavLink>
      </li>
      <li>
        <NavLink to="/register">Cadastrar</NavLink>
      </li>
    </>
  )}
</ul>

    </nav>
  </>
  );
};

export default Navbar;
