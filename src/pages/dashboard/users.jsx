import { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip
} from "@material-tailwind/react";
import axios from 'axios';
import { FiDelete, FiEdit2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Users() {

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);


  const token = sessionStorage.getItem('token');

  


  useEffect(() => {
    // Fetch data from the fake API endpoint
    axios.get('https://fx.wl-solutions.net/api/v1/roles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const roles  = response.data.data.map(role => ({ role_name: role.name, role_id: role.id }));
        setRoles(roles);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 
  
  useEffect(() => {
    // Fetch data from the fake API endpoint
    axios.get('https://fx.wl-solutions.net/api/v1/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUsers(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  const {
    register: registerAdd,
    handleSubmit: handleSubmitAdd,
    formState: { errors: errorsAdd },
  } = useForm()

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    setValue: setValueEdit,
  } = useForm()

  const handleAddUser = (data) => {

    axios.post('https://fx.wl-solutions.net/api/v1/user', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setDialogOpen(false)
        setUsers([...users, response.data.data])

      })
      .catch(error => {
        console.error('Error adding user:', error);
      });
  }

  useEffect(() => {
    //getting a single user
    if (editUserId) {
      axios.get(`https://fx.wl-solutions.net/api/v1/user/${editUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setEditUser(response.data.data);

        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [editUserId]);

  useEffect(() => {
    if (editUser) {
      setValueEdit("name", editUser.name);
      setValueEdit("role_id", editUser.role_id);
      setValueEdit("email", editUser.email);
      setValueEdit("status", editUser.status === 1 ? 'active' : 'disable');
    }
  }, [editUser, setValueEdit]);


  const handleEditUser = (data) => {   
    
     axios.put(`https://fx.wl-solutions.net/api/v1/user/${editUserId}`, {...data, status:'2'}, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        setEditUserDialogOpen(false)
        setUsers(users.map(user => user.id === editUserId ? response.data.data : user))
        
      })
      .catch(error => {
        console.error('Error editign user:', error);
      });
  };

  const user = sessionStorage.getItem('user')  || localStorage.getItem('user') !== null;
  const navigate = useNavigate();

  const handleDelete = (userId) => {
    console.log(userId)
    axios.delete(`https://fx.wl-solutions.net/api/v1/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        setUsers(users.filter(user => user.id !== userId))
        if(user.id === userId){
          sessionStorage.clear();
          localStorage.clear();
          navigate('/auth/sign-in')
        }

      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const savedUser = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));
  const allPermissions = savedUser.role_id === 1;

  return (
    <div className='mt-12 mb-8 flex flex-col gap-12'>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex items-center justify-between">
          <Typography variant="h6" color="white">
            Users
          </Typography>

          {savedUser?.permissions.some(permission => permission.name.includes("add tags")) &&
          <button className=' rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 ' onClick={() => setDialogOpen(true)}>+ Add User</button>
          }
          {allPermissions &&
          <button className=' rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 ' onClick={() => setDialogOpen(true)}>+ Add User</button>
          }
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Full Name", "Email", "Status", "Actions"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users?.map(
                ({ id, name, status, email }, key) => {
                  const className = `py-3 px-5 ${key === roles.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {status}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="outlined"
                          color={status ? "green" : "blue-gray"}
                          value={status ? "Active" : "Disable"} 
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 flex items-center gap-4">
                        {allPermissions  && (
                            <button className='text-blue-500 text-[1.3em]' onClick={() => { setEditUserId(id); setEditUserDialogOpen(true) }}>
                              <FiEdit2 />
                            </button>
                          )}
                          {savedUser?.permissions.some(permission => permission.name.includes("edit tags"))  && (
                            <button className='text-blue-500 text-[1.3em]' onClick={() => { setEditUserId(id); setEditUserDialogOpen(true) }}>
                              <FiEdit2 />
                            </button>
                          )}
                          {allPermissions && (
                            <button onClick={() => handleDelete(id)} className='text-red-500 text-[1.3em]'><FiDelete /></button>
                          )}
                          {allPermissions || (savedUser?.permissions?.some(permission => permission.name.includes('delete tags')) && (
                            <button onClick={() => handleDelete(id)} className='text-red-500 text-[1.3em]'><FiDelete /></button>
                          ))}
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {/* dialog of add user */}
      <div className={`${dialogOpen ? 'block' : 'hidden'} relative z-50`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0  z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <div className=" p-6  flex items-center justify-center">
              <div className="container max-w-screen-lg mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-4 px-4 md:p-8 mb-6">
                  <h1 className='text-2xl font-bold text-left mb-10'>Add New User</h1>
                  <form onSubmit={handleSubmitAdd(handleAddUser)}>


                    <div className="lg:col-span-2 text-left">
                      <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5">
                          <label htmlFor="name">Full Name</label>
                          <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"   {...registerAdd("name")} />
                        </div>

                        <div className="md:col-span-5">
                          <label htmlFor="email">Email Address</label>
                          <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-200" placeholder="email@domain.com"  {...registerAdd("email")} />
                        </div>

                        <div className="md:col-span-3">
                          <label htmlFor="password">Password</label>
                          <input type="password" name="password" id="password" className="h-10 border mt-1 rounded px-4 w-full bg-gray-200" placeholder=""  {...registerAdd("password")} />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="role_id">Role</label>
                          <select name="role_id" id="role_id" className='h-10 border mt-1 rounded px-4 w-full bg-gray-200'  {...registerAdd("role_id")}>
                           {
                             roles?.map((role) => (
                               <option value={role.role_id} key={role.role_id}>{role.role_name}</option>
                             ))
                           }
                          </select>
                        </div>

                        <div className="md:col-span-1">
                          <label htmlFor="zipcode">Status</label>
                          <select name="status" id="status" className='h-10 border mt-1 rounded px-4 w-full bg-gray-200'  {...registerAdd("status")}>
                            <option value="active">Active</option>
                            <option value="disable">Disable</option>
                          </select>
                        </div>


                        <div className="md:col-span-5 text-right">
                          <div className="inline-flex items-end gap-4">
                            <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded" onClick={() => setDialogOpen(false)}>close</button>
                            <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </form>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
      {/* dialog of edit user */}
      <div className={`${editUserDialogOpen ? 'block' : 'hidden'} relative z-50`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <div className=" p-6  flex items-center justify-center">
              <div className="container max-w-screen-lg mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-4 px-4 md:p-8 mb-6">
                <h1 className='text-2xl font-bold text-left mb-10'>Edit User</h1>
                  <form onSubmit={handleSubmitEdit(handleEditUser)}>


                    <div className="lg:col-span-2 text-left">
                      <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5">
                          <label htmlFor="name">Full Name</label>
                          <input type="text" name="name" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-200"   {...registerEdit("name")} />
                        </div>

                        <div className="md:col-span-5">
                          <label htmlFor="email">Email Address</label>
                          <input type="text" name="email" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-200" placeholder="email@domain.com"  {...registerEdit("email")} />
                        </div>


                        <div className="md:col-span-2">
                          <label htmlFor="role_id">Role</label>
                          <select name="role_id" id="role_id" className='h-10 border mt-1 rounded px-4 w-full bg-gray-200'  {...registerEdit("role_id")}>
                          {
                             roles?.map((role) => (
                               <option value={role.role_id} key={role.role_id}>{role.role_name}</option>
                             ))
                           }
                          </select>
                        </div>

                        <div className="md:col-span-1">
                          <label htmlFor="zipcode">Status</label>
                          <select name="status" id="status" className='h-10 border mt-1 rounded px-4 w-full bg-gray-200'  {...registerEdit("status")}>
                            <option value="active">Active</option>
                            <option value="disable">Disable</option>
                          </select>
                        </div>


                        <div className="md:col-span-5 text-right">
                          <div className="inline-flex items-end gap-4">
                            <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded" onClick={() => setEditUserDialogOpen(false)}>close</button>
                            <button type='submit' className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </form>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Users