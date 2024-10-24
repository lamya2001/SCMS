import React, { useState, useEffect } from "react";
import TransportRequestsTable from "./TransportRequestsTable";
import {
  fetchAllCurrentTransportRequests,
  searchTransportCurrentRequestById,
} from "../../../api/transportRequestsAPI";

function CurrentTransportRequests() {
  const [query, setQuery] = useState("");
  const [transportRequests, setTransportRequests] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);

  useEffect(() => {
    const getRequests = async () => {
      try {
        const requests = await fetchAllCurrentTransportRequests(); // Call the fetch all requests function
        setTransportRequests(requests);
        setFilteredRequests(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
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
      if (transportRequests) {
        //Search by id using data already fetched
        const filtered = transportRequests.filter((request) =>
          request.shortId?.toLowerCase().includes(searchQuery)
        );
        if (filtered.length > 0) {
          setFilteredRequests(filtered);
          foundResult = true; // Result found
        }
      }
      if (!foundResult) {
        try {
          //search by id in back-end
          const requestData = await searchTransportCurrentRequestById(
            searchQuery
          ); // Call search from API if data is not present locally
          if (requestData) {
            setFilteredRequests([requestData]);
            foundResult = true; // Result found
          } else {
            setFilteredRequests([]); // there is no results
          }
        } catch (error) {
          console.error("Error fetching request by id:", error);
          setFilteredRequests([]);
        }
      }
    } else {
      setFilteredRequests([]);
    }
  };

  return (
    <div className="RequestsTable">
      <div className="header-row">
        <div className="title">Current Transport Requests</div>
        <div className="search-container">
          <div className="search-label">Search by ID</div>
          <input
            type="search"
            placeholder="Search by ID"
            value={query}
            onChange={handleSearch}
            className="input-with-icon"
          />
        </div>
      </div>

      {transportRequests && filteredRequests.length ? ( // Conditional rendering
        <TransportRequestsTable data={filteredRequests} />
      ) : (
        <p className="background-message">
          {filteredRequests && filteredRequests.length === 0
            ? "No transport requests found"
            : "Loading requests..."}
        </p> // Display a loading message until data is available
      )}
    </div>
  );
}

export default CurrentTransportRequests;
