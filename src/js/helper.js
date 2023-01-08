import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from './config.js';

const timeout = function(second){
    return new Promise(function(_, reject){
        setTimeout(function(){
            reject(new Error(`Request took too long! Timeout after ${second} second`))
        }, second * 1000);
    });
};

// CARA PRAKTIS PENGGANTI getJSON() dan sendJSON()
export const AJAX = async function(url, uploadData = undefined){
    try {
        const fetchPro = uploadData 
            ? fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(uploadData),   // Convert data to JSON
                }) 
            : fetch(url);

        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);    // Menggunakan race untuk melihat siapa paling cepat dalam mengakses halaman, jika lambat maka akan memanggil timeout
        const data = await response.json();        

        if (!response.ok) throw new Error(`${data.message} (${response.status})`);

        return data;
    } catch (error) {
        throw error;
    }
}
/*
export const getJSON = async function(url){
    try{        
        const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);    // Menggunakan race untuk melihat siapa paling cepat dalam mengakses halaman, jika lambat maka akan memanggil timeout
        const data = await response.json();        

        if (!response.ok) throw new Error(`${data.message} (${response.status})`);

        return data;
    }catch(err){
        throw err;
    }
}

export const sendJSON = async function(url, uploadData){
    try{        
        const fetchPro = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData),   // Convert data to JSON
        });

        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);    // Menggunakan race untuk melihat siapa paling cepat dalam mengakses halaman, jika lambat maka akan memanggil timeout
        const data = await response.json();        

        if (!response.ok) throw new Error(`${data.message} (${response.status})`);

        return data;
    }catch(err){
        throw err;
    }
}
*/