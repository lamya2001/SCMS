import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
import {
  searchCurrentRequestById,
  searchCurrentRequestByMName,
  fetchAllCurrentRequests
} from '../../../api/rawMaterialRequestAPI';

function CurrentRequests() {
  const [query, setQuery] = useState('');
  const [rawMaterialRequests, setRawMaterialRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);


  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllCurrentRequests(); // Call the fetch all requests function
        setRawMaterialRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    getRequests(); // Call the function when the component is first loaded.
  }, []);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value.trim().toLowerCase();
    setQuery(searchQuery);

    const validShortId = /^m?[0-9a-z]{8}$/;
    let foundResult = false;

    //check if it is an id
    if (validShortId.test(searchQuery)) {
      //check if there are requests
      if (rawMaterialRequests) {
        //Search by id using data already fetched
        const filtered = rawMaterialRequests.filter((request) =>
          request.shortId?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      } if (!foundResult) {
        try {
          //search by id in back-end
          const requestData = await searchCurrentRequestById(searchQuery); // Call search from API if data is not present locally
          if (requestData) {
            setFilteredRequests([requestData]);
            foundResult = true; // Result found
          } else {
            setFilteredRequests([]); // there is no results
          }
        } catch (error) {
          console.error('Error fetching request by id:', error);
          setFilteredRequests([]);
        }
      }
    } if (!foundResult) {
      // Search by name using data already fetched
      if (rawMaterialRequests) {
        const filtered = rawMaterialRequests.filter((request) =>
          request.manufacturerName?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      } if (!foundResult) {
        //Search by name in back-end
        try {
          const requestData = await searchCurrentRequestByMName(searchQuery); // Call search from API if data is not present locally
          setFilteredRequests(requestData ? [requestData] : []);
        } catch (error) {
          console.error('Error fetching request by name:', error);
          setFilteredRequests([]);
        }
      }
    }
  };



  return (
    <div className='RequestsTable'>
      <div className="header-row">
        <div className="title">Current Requests</div>
        <div className="search-container">
          <div className='search-label'>Search by Name / ID</div>
          <input
            type="search"
            placeholder="Search by Name / ID"
            value={query}
            onChange={handleSearch}
            className="input-with-icon"
          />
        </div>
      </div>

      {rawMaterialRequests && filteredRequests.length ? ( // Conditional rendering
        <RequestsTable data={filteredRequests} />
      ) : (
        <p className='background-message'>
          {filteredRequests && filteredRequests.length === 0 ? 'No requests found' : 'Loading requests...'}
        </p> // Display a loading message until data is available
      )}

    </div>
  );
}

export default CurrentRequests