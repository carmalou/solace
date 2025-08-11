"use client";

import { useEffect, useState } from "react";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export default function Home() {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const handlePrevClick = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const handleNextClick = () => setPageNumber((prev) => prev + 1);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setPageNumber(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch(
      `/api/advocates?page=${pageNumber}&search=${debouncedSearchTerm}`
    ).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      });
    });
  }, [pageNumber, debouncedSearchTerm]);

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    fetch(
      `/api/advocates?page=${pageNumber}&search=${debouncedSearchTerm}`
    ).then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      });
    });
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={onChange}
          value={searchTerm}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {advocates.map((advocate) => {
            return (
              <tr>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => handlePrevClick()}
        >
          Prev
        </button>
        <button
          disabled={!pagination.hasNextPage}
          onClick={() => handleNextClick()}
        >
          Next
        </button>
      </div>
    </main>
  );
}
