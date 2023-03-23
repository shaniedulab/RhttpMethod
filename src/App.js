
import React, {useState,useEffect} from 'react';
import UserForm from './Components/UserForm';
import './App.css';
import UserDetails from './Components/UserDetails';
import axios from 'axios';
import Loader from './Components/Loader';


function App() {
  let[showForm, setShowForm] = useState(false);
  let[allUsers, setUsers] = useState([]);
  let[lodding, setLoading] = useState(false);
  let[errorMessage, setErrorMessage] = useState(null);
  let[EditUser, setEditUser] = useState(null);
  let[editUser, setUser] = useState(null);

  useEffect(()=>{
    feachUsers();
  },[])
  function addUserHandler(){
    setShowForm(true);
    setEditUser(false)
  }

  function closeForm(){
    setShowForm(false)
  }

  function onCreateUser(user){
    // fetch('https://chathttp-default-rtdb.sasia-southeast1.firebasedatabase.app/users.json',{
    //   method:'POST',
    //   body: JSON.stringify(user)
    // }).then((resp)=>{
    //   console.log(resp);
    // })
    if(!EditUser){
      axios.post('https://chathttp-default-rtdb.sasia-southeast1.firebasedatabase.app/users.json',user).then((resp)=>{
        feachUsers();  
        console.log(resp.data);
      })
    }
    else{
    console.log('jhgkjgjgkj',user)
    console.log('jhgkjgjgkj',editUser)
    
      axios.put('https://chathttp-default-rtdb.sasia-southeast1.firebasedatabase.app/users/'+editUser.id+'.json',user).then((resp)=>{
        console.log(resp.data);
        feachUsers();  
      }).catch((err)=>{
        setErrorMessage(err.message)
        })
      
    }
    setShowForm(false); 
  }
  
  function feachUsers(){
    setLoading(true)
    setErrorMessage(null)
    // fetch('https://chathttp-default-rtdb.sasia-southeast1.firebasedatabase.app/users.json').then((resp)=>{
    //   if(!resp.ok)
    //   {
    //     throw new Error("Something went wrong")
    //   }
    //   return resp.json();
    // }).then((data)=>{
    // let userData=[]
    // for(let key in data){
    //   userData.push({...data[key],id:key})
    // }
    // setUsers(userData);
    // }).catch((error)=>{
    //     setErrorMessage(error.message);
    //     setLoading(false)
    //  })
   
    axios.get('https://chathttp-default-rtdb.sasia-southeast1.firebasedatabase.app/users.json').then((resp)=>{
      return resp.data;
    }).then((data)=>{
    let userData=[]
    for(let key in data){
      userData.push({...data[key],id:key})
    }
    setUsers(userData);
    setLoading(false)
    }).catch((error)=>{
      setErrorMessage(error.message);
      setLoading(false)
    })
  }
  
  function onEditUser(user){
    console.log("onEditUser")
    setEditUser(true)
    setShowForm(true)
    setUser(user)
  }
  
  function onDeleteUser(user){
  let del=window.confirm("Are you sure you want to delete "+user.firstName+" "+user.lastName)
  if(del){
    axios.delete('https://chathttp-default-rtdb.sasia-southeast1.firebasedatabase.app/users/'+user.id+'.json').then((resp)=>{
      console.log(resp)
      feachUsers()
    }).catch((err)=>{
      setErrorMessage(err.message)
    })
  }
    console.log(user)
  }
  
  return (
      <div>
        <div className='page-header'>
          <button className='btn btn-success' onClick={addUserHandler}>Add User</button>
          <button className='btn btn-normal' onClick={feachUsers}>Get Users</button>
        </div>
        {!lodding && !errorMessage && <UserDetails users={allUsers} onEditUser={onEditUser} onDeleteUser={onDeleteUser}></UserDetails>}
        {errorMessage && <h1 style={{textAlign:'center'}}>{errorMessage}</h1>}
        {lodding && <Loader></Loader>}
        {showForm && <UserForm closeForm={closeForm} onCreateUser={onCreateUser} EditUser={EditUser} user={editUser}></UserForm>}
      </div>
  );
}

export default App;
