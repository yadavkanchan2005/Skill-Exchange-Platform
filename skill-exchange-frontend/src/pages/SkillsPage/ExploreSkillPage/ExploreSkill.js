import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getExploreSkills, getMySkills, sendExchangeRequest } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./ExploreSkill.css";

const ExploreSkills = () => {
  const [skills, setSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mySkills, setMySkills] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
    fetchMySkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await getExploreSkills();
      setSkills(res.data);
    } catch {
      toast.error("Failed to load skills.");
    }
  };

  const fetchMySkills = async () => {
    try {
      const res = await getMySkills();
      setMySkills(res.data);
    } catch {
      toast.error("Failed to load your skills.");
    }
  };

  const handleSendRequest = async (receiverSkill) => {
    if (mySkills.length === 0) {
      toast.error("You must add a skill before sending requests.");
      return;
    }

    const receiverId = receiverSkill.user?._id;
    const wantToLearnMatch = receiverSkill.description.match(/learn:\s*([a-zA-Z+#]+)/i);
    const receiverWantsToLearn = wantToLearnMatch ? wantToLearnMatch[1].toLowerCase() : null;
    const hasMatch = receiverSkill.description.match(/have:\s*([a-zA-Z+#]+)/i);
    const receiverHasSkillName = hasMatch ? hasMatch[1].toLowerCase() : receiverSkill.name.toLowerCase();

    const matchedSenderSkill = mySkills.find(skill =>
      skill.name.toLowerCase() === receiverWantsToLearn
    );
    const senderWantMatch = mySkills.find(skill =>
      skill.description.toLowerCase().includes(`learn: ${receiverHasSkillName}`)
    );

    if (!matchedSenderSkill || !senderWantMatch) {
      toast.warning("Skill match failed.");
      return;
    }

    try {
      await sendExchangeRequest({
        receiverId,
        senderSkill: matchedSenderSkill._id,
        receiverSkill: receiverSkill._id,
        message: `Let's exchange! I have ${receiverWantsToLearn} and want to learn ${receiverHasSkillName}.`
      });
      toast.success("Exchange request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="explore-container">
      <div className="explore-header">
        <button className="back-floating-btn" onClick={() => navigate("/dashboard")}>←</button>
        <h1 className="animated-title">Explore Skills</h1>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          className="form-control search-bar"
          placeholder="Search skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="container">
        {filteredSkills.map((skill) => {
          const profileImageUrl = skill.user?.profilePicture
            ? `https://skill-exchange-platform-pamq.onrender.com/uploads/${skill.user?.profilePicture}`
            : "/default.png";

          const descriptionLines = skill.description.split('\n').reduce((acc, line) => {
            if (/i have:/i.test(line)) {
              acc.have = line.replace(/i have:/i, "").trim();
            } else if (/i want to learn:/i.test(line)) {
              acc.want = line.replace(/i want to learn:/i, "").trim();
            } else {
              acc.about += line + " ";
            }
            return acc;
          }, { have: '', want: '', about: '' });

          const isExpanded = expandedCard === skill._id;
          const userName = skill.user?.name
            ? skill.user.name.charAt(0).toUpperCase() + skill.user.name.slice(1)
            : '';
          const capitalizedSkill = skill.name.charAt(0).toUpperCase() + skill.name.slice(1);

          return (
            <div className="card custom-skill-card mb-4" key={skill._id}>
              <div className="card-body d-flex align-items-center justify-content-between flex-wrap">
                <div className="d-flex align-items-center">
                  <img src={profileImageUrl} alt="profile" className="custom-profile-pic me-3" />
                  <div className="text-left">
                    <h5 className=" user-name mb-1">{userName}</h5>
                    <p className="skill-name mb-0">{capitalizedSkill}</p>

                    <button className="view" onClick={() =>
                      setExpandedCard(expandedCard === skill._id ? null : skill._id)
                    }>
                      View More
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3 mt-md-0">
                  <button className="btn btn-primary" onClick={() => handleSendRequest(skill)}>
                    Send Request
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="card-body skill-details">
                  <p><strong>I have:</strong> {descriptionLines.have}</p>
                  <p><strong>I want to learn:</strong> {descriptionLines.want}</p>
                  <p><strong>Level:</strong> {skill.level}</p>
                  <p><strong>About:</strong> {skill.about ? skill.about.trim() : 'No description provided.'}</p>

                </div>
              )}
            </div>
          );
        })}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ExploreSkills;

