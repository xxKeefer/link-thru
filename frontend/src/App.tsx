import { useQuery } from "@tanstack/react-query";

function App() {
  const { data, error } = usePing();
  console.log({ data, error });
  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-4xl">Test</h1>
      <p className="font-display">Test 1 2 3</p>
      <p className="font-emoji">🧙‍♂️</p>
      <p className="font-sans">Lorem Ipsum</p>
      <p className="font-sans font-black">Lorem Ipsum Fat</p>
      <p className="font-sans font-light">Lorem Ipsum thin</p>
      <p className="font-mono">Arigato Mr. Roboto</p>
    </main>
  );
}

export default App;

async function ping() {
  const response = await fetch("http://localhost:3000/ping", { method: "GET" });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

const usePing = () => {
  return useQuery({
    queryKey: ["ping"],
    queryFn: ping,
  });
};
