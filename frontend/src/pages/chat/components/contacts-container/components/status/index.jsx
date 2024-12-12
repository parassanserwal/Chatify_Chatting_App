import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { BASE_URL, GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE } from '@/utils/constants';
const StatusList = () => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        // await apiClient.post('/api/status/set-status', {
        //     uploader:userInfo.id,
        //     content,
        //     type: 'text',
        //   },{withCredentials:true});
        const response = await apiClient.get('/api/status/get-statuses',{withCredentials:true}); // Adjust the endpoint if necessary
        setStatuses(response.data);
        console.log(statuses);
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
      }
    };
    fetchStatuses();
  }, []);

  return (
    <div>
      {statuses.map(status => (
        
        <div key={status._id} className="status-item">
          <p
            className="cursor-pointer text-blue-500"
            onClick={() => alert(`Viewing status by: ${status.uploader.name}`)}
          >
            {status.uploader.firstName}
          </p>
          {console.log('Image URL:', `${BASE_URL}${encodeURI(status.imageUrl)}`)} 
          {status.type === 'text' && <p>{status.content}</p>}
          {status.type === 'image' && (
            <img src={`${BASE_URL}${encodeURI(status.imageUrl)}`} alt="Status" className="status-image" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusList;
