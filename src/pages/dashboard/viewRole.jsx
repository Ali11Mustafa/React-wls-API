import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function ViewRole() {


  const token = sessionStorage.getItem('token');

  const {id:roleId} = useParams()

  const [role, setRole] = useState({});

  useEffect(() => {
    if (roleId) {
      axios.get(`https://fx.wl-solutions.net/api/v1/role/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setRole(response.data.data);

        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [roleId]);


  const getFirstWord = (str) => {
    return str.split(' ')[0];
  };

  const permissionExists = (permissionName) => {
    const firstWordPermissionName = getFirstWord(permissionName);
    return role.permissions && role.permissions.some(permission => getFirstWord(permission.name) === firstWordPermissionName);
  };


  return (
   
    <div className="p-4 bg-white my-12 text-left">
    <div className="grid gap-4 gap-y-4 text-sm grid-cols-1 md:grid-cols-5">
      <div className="md:col-span-5">
        <label htmlFor="name" className='font-medium'>Name</label>
        <input type="text" value={
        role?.name} name="name" id="name" disabled className="h-10 border mt-4 rounded px-4 w-full bg-gray-200"/>
      </div>


      <div className=' mt-4 flex flex-col items-start gap-4 w-full  justify-between'>
        <h2 className='font-medium'>Permissions</h2>

        <div className='flex items-center gap-2'>
          <input type="checkbox"  name="add" id="add" className='cursor-pointer h-4 w-4 accent-blue-400  disabled:accent-blue-400' readOnly  checked={permissionExists("add")}/>
          <label htmlFor="add" className='cursor-pointer'>Add</label>
        </div>
        <div className='flex items-center gap-2'>
          <input type="checkbox" name="edit" id="edit" className='cursor-pointer h-4 w-4 rounded-lg accent-yellow-600 disabled:accent-yellow-600'   readOnly  checked={permissionExists("edit")}/>
          <label htmlFor="edit" className='cursor-pointer'>Edit</label>
        </div>
        <div className='flex items-center gap-2'>
          <input type="checkbox" name="delete" id="delete" className='cursor-pointer h-4 w-4 rounded-lg accent-red-400 disabled:accent-red-900 disabled:border-4' readOnly  checked={permissionExists("delete")}/>
          <label htmlFor="delete" className='cursor-pointer'>delete</label>
        </div>
        <div className='flex items-center gap-2'>
          <input type="checkbox" name="allData" id="allData" className='cursor-pointer h-4 w-4 rounded-lg accent-gray-900 disabled:accent-gray-900' readOnly  checked={permissionExists("allData")}/>
          <label htmlFor="allData" className='cursor-pointer'>All Data</label>
        </div>
      </div>



      <div className="md:col-span-5 text-center mt-5">
        <div className="inline-flex items-end gap-4">
          <button className="bg-orange-200 hover:bg-orange-300 text-black font-bold py-2 px-4 rounded" onClick={() => window.history.back()}>Go Back</button>
         
        </div>
      </div>

    </div>
  </div>
  )
}

export default ViewRole