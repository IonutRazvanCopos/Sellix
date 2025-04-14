export async function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  };  