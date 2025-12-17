import gyneImg from '../assets/gyneImg.jpg';
import neurologist from "../assets/neurologist.jpg"
import pediatric from "../assets/pediatric.jpg"
import Dermatologist from "../assets/Dermatologist.jpg"
import Gynecologist from "../assets/Gynecologist.jpg"
import Gastroentrologist from "../assets/Gastroentrologist.jpg"
import doc1 from "../assets/doc1.jpg"
import doc2 from "../assets/doc2.jpg"
import doc3 from "../assets/doc3.jpg"
import doc4 from "../assets/doc4.jpg"
import doc5 from "../assets/doc5.jpg"
import appointment from "./appointment.jpg";
import logo from "./logo.jpg";
import couple from "./couple.jpg";
import contact from './contact2.jpg';
import profile_imaage from "./profile_image.jpg"
import cross_icon from "./cross_icon.svg"
import icon from "./icon.jpg"
import menu_icon from "./menu.png"
export default {
  appointment,
  logo,
  couple,
  contact,
  profile_imaage,
  cross_icon,
  icon,
  menu_icon
};



    
export const specialityData = [
    {
        speciality: 'General physician',
        image: gyneImg
    },
    {
        speciality: 'Gynecologist',
        image: Gynecologist
    },
    {
        speciality: 'Dermatologist',
        image: Dermatologist
    },
    {
        speciality: 'Pediatrician',
        image: pediatric
    },
    {
        speciality: 'Neurologist',
        image: neurologist
    },
    {
        speciality: 'Gastroentrologist',
        image: Gastroentrologist
    }
];

export const doctors = [
  {
    _id: "doc1",
    name: "Dr. Riya Sharma",
    image: doc1,
    speciality: "General physician",
    degree: "MBBS, MD (Cardiology)",
    experience: "12 years",
    about: "Dr. Aakash Mehta is a leading cardiologist with expertise in heart disease management, cardiac imaging, and preventive cardiology.",
    fees: 1200,
    address: "HeartCare Clinic, Andheri West, Mumbai"
  },
  {
    _id: "doc2",
    name: "Dr. Aakash Mehta",
    image: doc2,
    speciality: "Dermatologist",
    degree: "MBBS, MD (Dermatology)",
    experience: "8 years",
    about: "Specialized in skin treatment, cosmetic dermatology, acne care, and laser treatments.",
    fees: 900,
    address: "SkinGlow Clinic, Koramangala, Bangalore"
  },
  {
    _id: "doc3",
    name: "Dr. Priya Nair",
    image: doc3,
    speciality: "Gynecologist",
    degree: "MBBS, MS (Orthopedics)",
    experience: "10 years",
    about: "Expert in joint replacement, sports injuries, and spine treatments.",
    fees: 1100,
    address: "OrthoPlus Hospital, Banjara Hills, Hyderabad"
  },
  {
    _id: "doc4",
    name: "Dr. Sameer Khan",
    image: doc4,
    speciality: "Pediatrician",
    degree: "MBBS, MD (Pediatrics)",
    experience: "7 years",
    about: "Dedicated to child healthcare, vaccinations, growth monitoring, and pediatric emergencies.",
    fees: 700,
    address: "LittleCare Clinic, Vyttila, Kochi"
  },
  {
    _id: "doc5",
    name: "Dr. Krishna Patel",
    image: doc5,
    speciality: "Neurologist",
    degree: "MBBS, DM (Neurology)",
    experience: "15 years",
    about: "Highly experienced neurologist specializing in stroke, migraine, epilepsy, and nerve disorders.",
    fees: 1500,
    address: "NeuroLife Center, SG Highway, Ahmedabad"
  }
];

