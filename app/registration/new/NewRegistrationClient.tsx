"use client";

import { useState } from "react";
import Link from "next/link";

const STEPS = [
  { label: "Personal Details", icon: "person" },
  { label: "Address", icon: "home" },
  { label: "Documents", icon: "upload_file" },
  { label: "Review & Submit", icon: "send" },
];

type FormData = {
  firstName: string; lastName: string; dob: string; gender: string;
  fatherName: string; mobile: string; email: string;
  houseNo: string; street: string; locality: string; city: string; state: string; pincode: string;
  epic: string; docType: string;
};

const INITIAL: FormData = {
  firstName:"", lastName:"", dob:"", gender:"", fatherName:"", mobile:"", email:"",
  houseNo:"", street:"", locality:"", city:"", state:"", pincode:"",
  epic:"", docType:"",
};

export default function NewRegistrationPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [refNum] = useState(() => "REG" + Math.floor(10000000 + Math.random() * 90000000));

  const set = (k: keyof FormData, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const field = (label: string, key: keyof FormData, type = "text", placeholder = "") => (
    <div>
      <label className="text-sm font-medium text-on-surface block mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary"
      />
    </div>
  );

  if (submitted) return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-4xl text-primary">task_alt</span>
      </div>
      <h2 className="text-2xl font-bold text-on-surface mb-2">Application Submitted!</h2>
      <p className="text-on-surface-variant mb-1">Your Form 6 registration has been submitted successfully.</p>
      <p className="text-sm text-on-surface-variant mb-6">Reference Number: <strong className="text-primary">{refNum}</strong></p>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm mx-auto">
        You will receive an SMS/email confirmation. Your Voter ID (EPIC) will be issued after verification by the Electoral Registration Officer (ERO), typically within 30–45 days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/registration/status" className="bg-primary text-on-primary px-6 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          Track Application Status
        </Link>
        <Link href="/registration" className="border border-outline-variant text-on-surface px-6 py-3 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors">
          Back to Registration
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      {/* Stepper */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i < step ? "bg-primary text-on-primary" : i === step ? "bg-primary text-on-primary ring-2 ring-primary ring-offset-2" : "bg-surface-container text-on-surface-variant"}`}>
                {i < step ? <span className="material-symbols-outlined text-[18px]">check</span> : <span className="material-symbols-outlined text-[18px]">{s.icon}</span>}
              </div>
              <span className={`text-xs mt-1 whitespace-nowrap ${i === step ? "text-primary font-medium" : "text-on-surface-variant"}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 mx-1 transition-colors ${i < step ? "bg-primary" : "bg-outline-variant"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-5">
        {step === 0 && (<>
          <h2 className="text-lg font-semibold text-on-surface">Personal Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("First Name", "firstName", "text", "e.g. Rahul")}
            {field("Last Name", "lastName", "text", "e.g. Sharma")}
            {field("Date of Birth", "dob", "date")}
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1.5">Gender</label>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="">Select…</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>
          {field("Father's / Husband's Name", "fatherName", "text", "e.g. Suresh Sharma")}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Mobile Number", "mobile", "tel", "e.g. 9876543210")}
            {field("Email Address", "email", "email", "e.g. rahul@example.com")}
          </div>
        </>)}

        {step === 1 && (<>
          <h2 className="text-lg font-semibold text-on-surface">Address (Current Residence)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("House / Flat No.", "houseNo", "text", "e.g. 12B")}
            {field("Street / Road", "street", "text", "e.g. MG Road")}
            {field("Locality / Colony", "locality", "text", "e.g. Koregaon Park")}
            {field("City / Town", "city", "text", "e.g. Pune")}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-on-surface block mb-1.5">State</label>
              <select value={form.state} onChange={(e) => set("state", e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="">Select State…</option>
                {["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            {field("PIN Code", "pincode", "text", "e.g. 411001")}
          </div>
        </>)}

        {step === 2 && (<>
          <h2 className="text-lg font-semibold text-on-surface">Identity Documents</h2>
          <div>
            <label className="text-sm font-medium text-on-surface block mb-1.5">Proof of Age (select one)</label>
            <select value={form.docType} onChange={(e) => set("docType", e.target.value)} className="w-full bg-surface border border-outline-variant rounded-lg py-3 px-4 text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">Select document type…</option>
              <option>Birth Certificate</option>
              <option>School Leaving Certificate (Class 10 Marksheet)</option>
              <option>Passport</option>
              <option>PAN Card</option>
              <option>Aadhaar Card</option>
            </select>
          </div>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors group">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">upload_file</span>
            <p className="text-sm font-medium text-on-surface mt-2">Click to upload your document</p>
            <p className="text-xs text-on-surface-variant mt-1">JPG, PNG or PDF · Max 2MB</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3 flex gap-2">
            <span className="material-symbols-outlined text-primary flex-shrink-0 text-[18px] mt-0.5">info</span>
            <p className="text-xs text-on-surface-variant">You must also bring the original document to the Electoral Registration Office for verification after submission.</p>
          </div>
        </>)}

        {step === 3 && (<>
          <h2 className="text-lg font-semibold text-on-surface">Review Your Application</h2>
          <div className="divide-y divide-outline-variant">
            {[
              ["Full Name", `${form.firstName} ${form.lastName}`],
              ["Date of Birth", form.dob],
              ["Gender", form.gender],
              ["Father's Name", form.fatherName],
              ["Mobile", form.mobile],
              ["Email", form.email],
              ["Address", `${form.houseNo}, ${form.street}, ${form.locality}, ${form.city}, ${form.state} - ${form.pincode}`],
              ["Document Type", form.docType],
            ].map(([label, value]) => (
              <div key={label} className="py-2.5 flex gap-4">
                <span className="text-sm text-on-surface-variant w-36 flex-shrink-0">{label}</span>
                <span className="text-sm text-on-surface font-medium break-all">{value || "—"}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 bg-surface-container-low rounded-lg p-3">
            <input type="checkbox" id="declare" className="mt-0.5 text-primary focus:ring-primary" />
            <label htmlFor="declare" className="text-xs text-on-surface-variant cursor-pointer">
              I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that providing false information is a punishable offense under the Representation of the People Act, 1950.
            </label>
          </div>
        </>)}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex-1 border border-outline-variant text-on-surface py-3 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span> Previous
          </button>
        )}
        <button
          onClick={() => step < STEPS.length - 1 ? setStep(s => s + 1) : setSubmitted(true)}
          className="flex-1 bg-primary text-on-primary py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
        >
          {step < STEPS.length - 1 ? <>Next <span className="material-symbols-outlined text-[18px]">arrow_forward</span></> : <>Submit Application <span className="material-symbols-outlined text-[18px]">send</span></>}
        </button>
      </div>
    </div>
  );
}
