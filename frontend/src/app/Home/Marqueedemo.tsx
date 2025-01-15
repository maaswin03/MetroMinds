import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const reviews = [
  {
    name: "Emily",
    username: "@emily",
    body: "MetroMinds has revolutionized how we monitor flood zones in our city. It's a game-changer for urban management.",
    img: "https://avatar.vercel.sh/emily",
  },
  {
    name: "Michael",
    username: "@michael",
    body: "The earthquake prediction system from MetroMinds provides invaluable early warnings. It’s a must-have for any city.",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Sophia",
    username: "@sophia",
    body: "Smart waste management has never been easier. MetroMinds makes the process efficient and cost-effective.",
    img: "https://avatar.vercel.sh/sophia",
  },
  {
    name: "Liam",
    username: "@liam",
    body: "Traffic congestion has significantly reduced since we started using MetroMinds' traffic flow optimization features.",
    img: "https://avatar.vercel.sh/liam",
  },
  {
    name: "Olivia",
    username: "@olivia",
    body: "MetroMinds’ noise pollution monitoring has helped us enforce regulations and improve urban living conditions.",
    img: "https://avatar.vercel.sh/olivia",
  },
  {
    name: "Ethan",
    username: "@ethan",
    body: "The real-time alerts from MetroMinds have made urban management incredibly responsive and effective.",
    img: "https://avatar.vercel.sh/ethan",
  },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",

        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",

        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

function MarqueeDemo() {
  return (
    <div className="flex h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-background md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}

export default MarqueeDemo;
