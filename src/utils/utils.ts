//export const API_SERVER = 'http://192.168.2.52:3500'
//export const API_SERVER = 'http://127.0.0.1:3500'
export const API_SERVER = 'https://api-herohr.onrender.com'

export const isRecruiterAuthenticated = async()=>{	
	const res = await fetch(API_SERVER+'/api/recruiter/auth', {credentials: 'include'})
	if(res.ok){
		return true
	}
	
	return false
}

export const getRecruiterName = async()=>{
	const res = await fetch(API_SERVER + '/api/recruiter/name', {credentials: 'include'})
	if(!res.ok){
		return ''
	}

	const data = await res.json()	
	return data?.name
}
export const isHexColor = async(input: string)=>{
  const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

  return hexColorRegex.test(input);
}

/* Créditos para fazlulkarimweb https://github.com/fazlulkarimweb/string-sanitizer */
export const isEmail = (email: string)=>{
	const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (regex.test(email)) {
		return email;
	} else {
		return false;
	}
}

export const isPassword = (password: string)=>{
	const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
	if (regex.test(password)) {
		return password;
	} else {
		return false;
	}
}

export const isUsername = (username: string)=>{
	const regex = /^[a-z][a-z]+\d*$|^[a-z]\d{2,}$/i;
	if (regex.test(username)) {
		return username.toLowerCase();
	} else {
		return false;
	}
}
