import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import axios from 'axios';
import { FiDelete, FiEdit2, FiEye } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function Roles() {

  const [roles, setRoles] = useState([]);
  const [editRoleId, setEditRoleId] = useState(null);
  const [editRole, setEditRole] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false);


  const token = sessionStorage.getItem('token');




  useEffect(() => {
    // Fetch data from the fake API endpoint
    axios.get('https://fx.wl-solutions.net/api/v1/roles', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const roles = response.data.data.map(role => ({ role_name: role.name, role_id: role.id }));
        setRoles(roles);
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


  const handleAddRole = (data) => {
    let newData = new FormData();
    newData.append('name', data.name);

    if (data.add) {
      newData.append('permissions[1]', '2');
    }
    if (data.edit) {
      newData.append('permissions[2]', '3');
    }
    if (data.delete) {
      newData.append('permissions[3]', '4');
    }
    if (data.allDate) {
      newData.append('permissions[5]', '4');
    }

    axios.post('https://fx.wl-solutions.net/api/v1/role', newData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setDialogOpen(false)
        setRoles([...roles, response.data.data])
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding role:', error);
      });
  }

  useEffect(() => {
    //getting a single user
    if (editRoleId) {
      axios.get(`https://fx.wl-solutions.net/api/v1/role/${editRoleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setEditRole(response.data.data);
       

        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [editRoleId]);

  const getFirstWord = (str) => {
    return str.split(' ')[0];
  };

  const permissionExists = (permissionName) => {
    const firstWordPermissionName = getFirstWord(permissionName);
    return editRole.permissions && editRole.permissions.some(permission => getFirstWord(permission.name) === firstWordPermissionName);
  };

  useEffect(() => {
    if (editRole) {
      setValueEdit("name", editRole.name);
      setValueEdit("add", permissionExists("add"));
      setValueEdit("edit", permissionExists("edit"));
      setValueEdit("delete", permissionExists("delete"));
      setValueEdit("allDate", permissionExists("allDate"));


    }
  }, [editRole, setValueEdit]);


  const handleEditRole = (data) => {
    const editedData = {
      name: data.name,
      permissions: {}
    };

    // Set permissions based on checkbox values

    if (data.add) {
      editedData.permissions['permissions[1]'] = '2';
    }
    if (data.edit) {
      editedData.permissions['permissions[2]'] = '3';
    }
    if (data.delete) {
      editedData.permissions['permissions[3]'] = '4';
    }
    if (data.allDate) {
      editedData.permissions['permissions[4]'] = '5';
    }


    axios.put(`https://fx.wl-solutions.net/api/v1/role/${editRoleId}`, editedData, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        setEditRoleDialogOpen(false)

      })
      .catch(error => {
        console.error('Error editign role:', error);
      });

  };


  const handleDelete = (roleId) => {
    axios.delete(`https://fx.wl-solutions.net/api/v1/role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(response => {
        setRoles(roles.filter(role => role.role_id !== roleId))
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  const user = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user'));

  const allPermissions = user.role_id === 1;



  return (
    <div className='mt-12 mb-8 flex flex-col gap-12'>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex items-center justify-between">
          <Typography variant="h6" color="white">
            Roles Lists
          </Typography>
          {user?.permissions.some(permission => permission.name.includes("add tags")) &&
          <button className=' rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 ' onClick={() => setDialogOpen(true)}>+ Add New Role</button>
          }
          {allPermissions &&
          <button className=' rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 ' onClick={() => setDialogOpen(true)}>+ Add New Role</button>
          }
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Name", "Actions"].map((el) => (
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
              {roles?.map(
                ({ role_id, role_name }, key) => {
                  const className = `py-3 px-5 ${key === roles.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                  return (
                    <tr key={role_id}>
                      <td className={role_name}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold ml-5"
                            >
                              {role_name}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600 flex items-center gap-4">

                          <Link to={`/dashboard/roles/${role_id}`} className='text-purple-500 text-[1.3em]'>
                            <FiEye />
                          </Link>

                          {allPermissions  && (
                            <button className='text-blue-500 text-[1.3em]' onClick={() => { setEditRoleId(role_id); setEditRoleDialogOpen(true) }}>
                              <FiEdit2 />
                            </button>
                          )}
                          {user?.permissions.some(permission => permission.name.includes("edit tags"))  && (
                            <button className='text-blue-500 text-[1.3em]' onClick={() => { setEditRoleId(role_id); setEditRoleDialogOpen(true) }}>
                              <FiEdit2 />
                            </button>
                          )}
                          {allPermissions && (
                            <button onClick={() => handleDelete(role_id)} className='text-red-500 text-[1.3em]'><FiDelete /></button>
                          )}
                          {allPermissions || (user?.permissions?.some(permission => permission.name.includes('delete tags')) && (
                            <button onClick={() => handleDelete(role_id)} className='text-red-500 text-[1.3em]'><FiDelete /></button>
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
                  <h1 className='text-2xl font-bold text-left mb-10'>Add New Role</h1>
                  <form onSubmit={handleSubmitAdd(handleAddRole)}>


                    <div className="lg:col-span-2 text-left">
                      <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5">
                          <label htmlFor="name" className='font-medium'>Name</label>
                          <input type="text" name="name" id="name" className="h-10 border mt-4 rounded px-4 w-full bg-gray-200"   {...registerAdd("name")} />
                        </div>


                        <div className=' mt-4 flex flex-col items-start gap-4 w-full  justify-between'>
                          <h2 className='font-medium'>Permissions</h2>

                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="add" id="add" className='cursor-pointer h-4 w-4 accent-blue-400 ' {...registerAdd("add")} />
                            <label htmlFor="add" className='cursor-pointer'>Add</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="edit" id="edit" className='cursor-pointer h-4 w-4 rounded-lg accent-yellow-600' {...registerAdd("edit")} />
                            <label htmlFor="edit" className='cursor-pointer'>Edit</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="delete" id="delete" className='cursor-pointer h-4 w-4 rounded-lg accent-red-400' {...registerAdd("delete")} />
                            <label htmlFor="delete" className='cursor-pointer'>delete</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="allDate" id="allDate" className='cursor-pointer h-4 w-4 rounded-lg accent-gray-900' {...registerAdd("allDate")} />
                            <label htmlFor="allDate" className='cursor-pointer'>All Date</label>
                          </div>
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
      <div className={`${editRoleDialogOpen ? 'block' : 'hidden'} relative z-50`} aria-labelledby="modal-title" role="dialog" aria-modal="true">

        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

            <div className=" p-6  flex items-center justify-center">
              <div className="container max-w-screen-lg mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-4 px-4 md:p-8 mb-6">
                  <h1 className='text-2xl font-bold text-left mb-10'>Edit Role</h1>
                  <form onSubmit={handleSubmitEdit(handleEditRole)}>


                    <div className="lg:col-span-2 text-left">
                      <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
                        <div className="md:col-span-5">
                          <label htmlFor="name" className='font-medium'>Name</label>
                          <input type="text" name="name" id="name" className="h-10 border mt-4 rounded px-4 w-full bg-gray-200"   {...registerEdit("name")} />
                        </div>


                        <div className=' mt-4 flex flex-col items-start gap-4 w-full  justify-between'>
                          <h2 className='font-medium'>Permissions</h2>

                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="add" id="add" className='cursor-pointer h-4 w-4 accent-blue-400 ' {...registerEdit("add")} />
                            <label htmlFor="add" className='cursor-pointer'>Add</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="edit" id="edit" className='cursor-pointer h-4 w-4 rounded-lg accent-yellow-600' {...registerEdit("edit")} />
                            <label htmlFor="edit" className='cursor-pointer'>Edit</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="delete" id="delete" className='cursor-pointer h-4 w-4 rounded-lg accent-red-400' {...registerEdit("delete")} />
                            <label htmlFor="delete" className='cursor-pointer'>delete</label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input type="checkbox" name="allDate" id="allDate" className='cursor-pointer h-4 w-4 rounded-lg accent-gray-900' {...registerEdit("allDate")} />
                            <label htmlFor="allDate" className='cursor-pointer'>All Date</label>
                          </div>
                        </div>



                        <div className="md:col-span-5 text-right">
                          <div className="inline-flex items-end gap-4">
                            <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded" onClick={() => setEditRoleDialogOpen(false)}>close</button>
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
    </div>
  )
}

export default Roles