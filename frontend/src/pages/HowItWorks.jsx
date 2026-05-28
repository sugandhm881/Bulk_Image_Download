import {
  FaFileExcel,
  FaLink,
  FaCloudDownloadAlt,
  FaFileArchive,
  FaShieldAlt,
  FaBolt,
  FaFolderOpen
} from "react-icons/fa";

const steps = [
  {
    icon: FaFileExcel,
    title: "1. Upload your Excel file",
    text: "Select an .xlsx or .xls file that contains image URLs. Add a user_name column to group images per user, and an optional bill_date column to sort them into month folders.",
  },
  {
    icon: FaLink,
    title: "2. URLs are extracted",
    text: "Every cell is scanned and valid image links (.jpg, .jpeg, .png, .gif, .bmp, .webp) are detected automatically. Duplicate URLs are skipped so nothing downloads twice.",
  },
  {
    icon: FaCloudDownloadAlt,
    title: "3. Images download in parallel",
    text: "Images are fetched concurrently with automatic retries, then organised into clean User / Month folders along with a summary report.",
  },
  {
    icon: FaFileArchive,
    title: "4. Get a single ZIP",
    text: "Everything is bundled into one ZIP and delivered straight to your browser. Click 'Download ZIP' on the Dashboard once processing finishes.",
  },
];

const features = [
  { icon: FaShieldAlt, title: "No server clutter", text: "Files are never kept in the project folder — they are zipped and streamed to you, then cleaned up." },
  { icon: FaBolt, title: "Fast & concurrent", text: "Up to 50 parallel connections with retry logic for reliable bulk downloads." },
  { icon: FaFolderOpen, title: "Organised output", text: "Auto-sorted into User → Month folders with a built-in Excel report." },
];

function HowItWorks() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-800 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          How <span className="text-cyan-400">Bulk Image Download</span> Works
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Turn a spreadsheet full of image links into a single, neatly organised ZIP in four simple steps.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <Icon className="text-cyan-400 text-lg" />
            </div>
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Why use it</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
              <Icon className="text-cyan-400 text-xl mb-3" />
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-slate-400 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-slate-500 text-sm pt-2">
        Tool Created By <span className="text-cyan-400 font-semibold">Sugandh K Mishra</span>
      </p>

    </div>
  );
}

export default HowItWorks;
