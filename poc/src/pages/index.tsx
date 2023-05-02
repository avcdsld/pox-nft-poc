import Link from 'next/link';

export default function Home() {
  return (
    <div style={{margin: 20}}>
      <Link href="/account">
        <button>Receive NFT</button>
      </Link>
    </div>
  )
}
