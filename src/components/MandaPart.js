import styled from "styled-components";

const MandaPart = ({ data }) => (
  <SmallTableWrapper>
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </SmallTableWrapper>
);

const SmallTableWrapper = styled.table`
border-collapse: collapse;
width: 100%;
height: 100%;
table-layout: fixed;

td {
  border: 1px solid #ccc;
  padding: 0; 
  text-align: center;
  width: 80px;
  height: 70px;
}
`;

export default MandaPart;