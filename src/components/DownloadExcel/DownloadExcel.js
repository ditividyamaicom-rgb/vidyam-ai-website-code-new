import * as XLSX from 'xlsx';
import { supabase } from '../../supabaseClinet';


export const flattenJson = (data) => {
    return data.map((row) => {
      let flattenedRow = {};
      for (const key in row) {
        if (typeof row[key] === 'object' && row[key] !== null) {
          flattenedRow[key] = JSON.stringify(row[key], null, 2); // Format JSON with indentation for readability
        } else {
          flattenedRow[key] = row[key];
        }
      }
      return flattenedRow;
    });
  };
  
  


 export const exportToExcel = (data, filename = 'data.xlsx') => {
    const flattenedData = flattenJson(data);
  
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

export const fetchData = async (table) => {
    let { data, error } = await supabase
      .from(table)
      .select('*');
  
    if (error) {
      console.error('Error fetching data:', error);
      return [];
    }
    console.log(data)
    return data;
  };


  
