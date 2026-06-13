import { ReactNode, useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export interface InfoImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface InfoPopoverProps {
  title: string;
  /** Rich content for the info tab. String paragraphs (split on \n\n) or ReactNode. */
  content: ReactNode;
  images?: InfoImage[];
  /** Optional YouTube/Vimeo/mp4 URL. If provided, a video tab is shown. */
  videoUrl?: string;
  ariaLabel?: string;
  className?: string;
}

const isEmbeddable = (url: string) =>
  /youtube\.com|youtu\.be|vimeo\.com/.test(url);

const toEmbedUrl = (url: string) => {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
};

export const InfoPopover = ({
  title,
  content,
  images,
  videoUrl,
  ariaLabel,
  className,
}: InfoPopoverProps) => {
  const { t, lang } = useLang() as any;
  const [open, setOpen] = useState(false);
  const hasVideo = !!videoUrl;

  const moreInfo = lang === "de" ? "Mehr Informationen" : "More information";
  const infoTab = lang === "de" ? "Information" : "Information";
  const videoTab = lang === "de" ? "Video" : "Video";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel ?? moreInfo}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-smooth hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            className
          )}
        >
          <Info className="h-3.5 w-3.5" strokeWidth={2.25} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {hasVideo ? (
          <Tabs defaultValue="info" className="mt-2">
            <TabsList>
              <TabsTrigger value="info">{infoTab}</TabsTrigger>
              <TabsTrigger value="video">{videoTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <InfoBody content={content} images={images} />
            </TabsContent>
            <TabsContent value="video" className="mt-4">
              <VideoBlock url={videoUrl!} title={title} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-2">
            <InfoBody content={content} images={images} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const InfoBody = ({ content, images }: { content: ReactNode; images?: InfoImage[] }) => (
  <div className="space-y-4">
    {typeof content === "string" ? (
      content
        .split(/\n\n+/)
        .map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))
    ) : (
      <div className="text-sm leading-relaxed text-muted-foreground">{content}</div>
    )}
    {images && images.length > 0 && (
      <div className={cn("grid gap-3", images.length > 1 ? "sm:grid-cols-2" : "")}>
        {images.map((img, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-border bg-muted">
            <img src={img.src} alt={img.alt ?? ""} className="h-auto w-full object-cover" loading="lazy" />
            {img.caption && (
              <figcaption className="px-3 py-2 text-xs text-muted-foreground">{img.caption}</figcaption>
            )}
          </figure>
        ))}
      </div>
    )}
  </div>
);

const VideoBlock = ({ url, title }: { url: string; title: string }) => {
  if (isEmbeddable(url)) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={toEmbedUrl(url)}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video controls className="aspect-video w-full rounded-lg bg-black">
      <source src={url} />
    </video>
  );
};
