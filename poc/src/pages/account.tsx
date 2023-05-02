import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import axios from 'axios';

export default function Account() {
  const { data: session } = useSession();
  const [name, setName] = useState('');
  const [txHash, setTxHash] = useState('');
  const [user, setUser] = useState();

  const mint = async () => {
    const res = await axios.post('/api/mint', { name });
    setTxHash(res.data.txHash);
  };
  
  const getUser = async () => {
    const user = (await axios.get('/api/user')).data;
    setUser(user);
  };

  return (
    <div style={{ margin: 20 }}>
      {session ? (
        <>
          <div>
            Name: <input type='text' value={name} onChange={(e) => setName(e.target.value)}></input>
            {' '}
            <button onClick={() => mint()}>
              Mint
            </button>
          </div>

          <p>{txHash}</p><br/>

          <div>
            <button onClick={() => getUser()}>
              Get User
            </button>
          </div>

          <p>{JSON.stringify(user)}</p><br/>

          <div>
            <button onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        </>
      ) : (
        <div>
          <button onClick={() => signIn()}>SignIn</button>
        </div>
      )}
    </div>
  )
}
