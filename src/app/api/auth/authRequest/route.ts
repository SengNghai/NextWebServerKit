const refreshToken = async (expiredToken: string) => {
    try {
      const response = await fetch('/api/refreshToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: expiredToken }),
      });
  
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token); // 更新 Token
      }
      return data.token;
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  };
  
  export const authRequest = async (url: string, options: RequestInit) => {
    let token = localStorage.getItem('token');
  
    if (!token) {
      throw new Error('User not authenticated');
    }
  
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  
    const response = await fetch(url, options);
  
    // 如果返回 401 未授权，则尝试续约 Token
    if (response.status === 401) {
      token = await refreshToken(token);
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
        return fetch(url, options); // 重试请求
      }
    }
  
    return response;
  };
  