import DocumentEditor from "./components/Editor";

export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>My Document Editor</h1>
      <DocumentEditor />
    </div>
  );
}