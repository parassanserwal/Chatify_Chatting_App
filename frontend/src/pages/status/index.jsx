// import React, { useState } from 'react';
// import axios from 'axios';
// import { userAppStore } from '@/store'

// import { apiClient } from '@/lib/api-client';
// const SetStatus = () => {
//   const [content, setContent] = useState('');
//   const [type, setType] = useState('text'); // 'text' or 'image'
//   const [imageFile, setImageFile] = useState(null);
//   const {userInfo} = userAppStore();
//   // Handle text or image status submission
//   const handleSetStatus = async () => {
//     try {
//       // If type is 'image', use FormData to handle the image upload
//       if (type === 'image' && imageFile) {
//         const formData = new FormData();
//         formData.append('uploader', userInfo.id);
//         formData.append('type', 'image');
//         formData.append('image', imageFile);

//         // Send the image status data
//         // await apiClient.post('/api/status/set-status', formData, {
        
//         //   headers: {
//         //     'Content-Type': 'multipart/form-data',
//         //   },
//         // },{withCredentials:true});
//         await apiClient.post('/api/status/set-status', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
            
//             },
//             withCredentials: true, // Ensure cookies are included if needed
//           });
//       } else {
//         // If type is 'text', send the status as text
//         await apiClient.post('/api/status/set-status', {
//           uploader:userInfo.id,
//           content,
//           type: 'text',
//         },{withCredentials:true});
//       }

//       alert('Status updated successfully');
//       setContent(''); // Clear input after success
//       setImageFile(null); // Clear image after success
//       setType('text'); // Reset type to text
//     } catch (error) {
//     console.log(error);
//       alert('Failed to update status');
//     }
//   };

//   return (
//     <div className="p-4">
//       {/* Radio buttons to choose between text or image status */}
//       <div className="mb-3">
//         <label className="mr-3">
//           <input
//             type="radio"
//             value="text"
//             checked={type === 'text'}
//             onChange={() => setType('text')}
//             className="mr-1"
//           />
//           Text
//         </label>
//         <label>
//           <input
//             type="radio"
//             value="image"
//             checked={type === 'image'}
//             onChange={() => setType('image')}
//             className="mr-1"
//           />
//           Image
//         </label>
//       </div>

//       {/* Show input based on selected type */}
//       {type === 'text' ? (
//         <input
//           type="text"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="What's on your mind?"
//           className="border p-2 mb-3 w-full"
//         />
//       ) : (
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setImageFile(e.target.files[0])}
//           className="mb-3"
//         />
//       )}

//       <button onClick={handleSetStatus} className="bg-blue-500 text-white p-2 rounded">
//         Set Status
//       </button>
//     </div>
//   );
// };

// export default SetStatus;
import React, { useState } from 'react';
import { userAppStore } from '@/store';
import { apiClient } from '@/lib/api-client';

const SetStatus = () => {
  const [content, setContent] = useState('');
  const [type, setType] = useState('text'); // 'text' or 'image'
  const [imageFile, setImageFile] = useState(null);
  const { userInfo } = userAppStore();

  const handleSetStatus = async () => {
    try {
      if (type === 'image' && imageFile) {
        const formData = new FormData();
        formData.append('uploader', userInfo.id);
        formData.append('type', 'image');
        formData.append('image', imageFile);

        await apiClient.post('/api/status/set-status', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });
      } else {
        await apiClient.post('/api/status/set-status', {
          uploader: userInfo.id,
          content,
          type: 'text',
        }, { withCredentials: true });
      }

      alert('Status updated successfully');
      setContent('');
      setImageFile(null);
      setType('text');
    } catch (error) {
      console.log(error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1D25] text-white flex justify-center items-center">
      <div className="bg-[#292B36] p-6 rounded-lg shadow-lg w-80">
        <h1 className="text-lg font-bold mb-4 text-center">Set Your Status</h1>

        <div className="flex justify-center gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="text"
              checked={type === 'text'}
              onChange={() => setType('text')}
              className="text-[#4CAF50] focus:ring-[#4CAF50]"
            />
            <span>Text</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="image"
              checked={type === 'image'}
              onChange={() => setType('image')}
              className="text-[#4CAF50] focus:ring-[#4CAF50]"
            />
            <span>Image</span>
          </label>
        </div>

        {type === 'text' ? (
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-2 rounded border-none bg-[#1C1D25] text-white placeholder-gray-400 mb-4 focus:outline-none focus:ring focus:ring-[#4CAF50]"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full p-2 rounded bg-[#1C1D25] text-white placeholder-gray-400 mb-4 focus:outline-none focus:ring focus:ring-[#4CAF50]"
          />
        )}

        <button
          onClick={handleSetStatus}
          className="w-full bg-[#4CAF50] text-white py-2 rounded font-bold hover:bg-[#45A049] transition-all"
        >
          Set Status
        </button>
      </div>
    </div>
  );
};

export default SetStatus;
