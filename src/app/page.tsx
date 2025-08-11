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

  const [pagination, setPagination] = useState<{
    hasPrevPage: boolean;
    hasNextPage: boolean;
  }>({
    hasPrevPage: false,
    hasNextPage: false,
  });

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <p>
          Find an advocate: <span id="search-term"></span>
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
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              First Name
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              Last Name
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              City
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              Degree
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              Specialties
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              Years of Experience
            </th>
            <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody>
          {advocates.map((advocate, i) => {
            return (
              <tr key={`advocate-${i}`}>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.firstName}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.lastName}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.city}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.degree}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.specialties.slice(0, 3).map((s, i) => (
                    <div key={`specialties-${i}`}>{s}</div>
                  ))}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.yearsOfExperience}
                </td>
                <td className="p-4 border-b border-blue-gray-50">
                  {advocate.phoneNumber}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="w-full flex justify-between pt-4">
        <button
          disabled={!pagination.hasPrevPage}
          onClick={() => handlePrevClick()}
          className="py-1 px-4 rounded border border-blue-gray-200"
        >
          Prev
        </button>
        <button
          disabled={!pagination.hasNextPage}
          onClick={() => handleNextClick()}
          className="py-1 px-4 rounded border border-blue-gray-200"
        >
          Next
        </button>
      </div>
    </main>
  );
}
