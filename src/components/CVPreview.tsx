import type {CVData} from '../types';

interface CVPreviewProps {
  cv: CVData;
}

export function CVPreview({cv}: CVPreviewProps) {
  const {personal, summary, experiences, education, languages, competencies, technicalSkills, publicationsOrAwards, references, template} = cv;

  if (template === 'un-p11') {
    return (
      <div
        id="cv-print-sheet"
        className="w-full bg-white text-slate-900 p-8 sm:p-10 shadow-sm border border-slate-200 text-[12.5px] leading-[1.55]"
      >
        {/* UN P11 Dossier Header */}
        <div className="border-b-2 border-[#005A9C] pb-5 flex items-start justify-between gap-6">
          <div className="space-y-1.5 min-w-0 flex-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#005A9C] font-medium">
              International Personal History Profile · United Nations Format
            </p>
            <h3 className="font-editorial text-2xl font-bold text-slate-950 tracking-tight">
              {personal.fullName || 'Applicant Full Name'}
            </h3>
            {personal.targetTitle && (
              <p className="text-sm font-medium text-slate-700">{personal.targetTitle}</p>
            )}
            <div className="pt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-slate-600">
              {personal.location && <span>{personal.location}</span>}
              {personal.email && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{personal.email}</span>
                </>
              )}
              {personal.phone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{personal.phone}</span>
                </>
              )}
              {personal.linkedin && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{personal.linkedin}</span>
                </>
              )}
            </div>
          </div>

          {personal.photoDataUrl && (
            <img
              src={personal.photoDataUrl}
              alt={personal.fullName || 'Applicant portrait'}
              className="h-24 w-20 object-cover border border-slate-300 shrink-0"
            />
          )}
        </div>

        {/* P11 Personal Identification Table */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-slate-200 pb-4 text-[11.5px]">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500">Nationality</span>
            <span className="font-medium text-slate-900">
              {personal.nationality || '—'}
              {personal.secondNationality ? ` / ${personal.secondNationality}` : ''}
            </span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500">Date of Birth</span>
            <span className="font-mono tabular-nums text-slate-900">{personal.dateOfBirth || '—'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500">Gender</span>
            <span className="text-slate-900">{personal.gender || '—'}</span>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-500">Duty Readiness</span>
            <span className="text-slate-900">Global / Regional</span>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <section className="mt-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-2">
              01. Executive Profile & Mandate Alignment
            </h4>
            <p className="text-slate-800 whitespace-pre-line">{summary}</p>
          </section>
        )}

        {/* Core Competencies */}
        {(competencies.length > 0 || technicalSkills.length > 0) && (
          <section className="mt-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-2">
              02. UN Core Competencies & Technical Expertise
            </h4>
            <div className="space-y-1.5 text-[12px]">
              {competencies.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Core Competencies: </span>
                  <span className="text-slate-700">{competencies.join(' · ')}</span>
                </p>
              )}
              {technicalSkills.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Technical & Policy Tools: </span>
                  <span className="text-slate-700">{technicalSkills.join(' · ')}</span>
                </p>
              )}
            </div>
          </section>
        )}

        {/* Employment Record */}
        {experiences.length > 0 && (
          <section className="mt-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-3">
              03. Employment Record (Most Recent First)
            </h4>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h5 className="font-semibold text-slate-950 text-[13px]">{exp.role || 'Position Title'}</h5>
                    <span className="font-mono text-[11px] text-slate-600 tabular-nums">
                      {exp.startDate || 'Start'} — {exp.current ? 'Present' : exp.endDate || 'End'}
                    </span>
                  </div>
                  <div className="text-[12px] text-slate-600">
                    <span className="font-medium text-slate-800">{exp.organization}</span>
                    {exp.location && <span> · {exp.location}</span>}
                    {exp.supervisorName && <span> · Supervisor: {exp.supervisorName}</span>}
                  </div>
                  {exp.achievements.length > 0 && (
                    <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-700">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mt-5">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-3">
              04. University & Academic Credentials
            </h4>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h5 className="font-semibold text-slate-950">
                      {edu.degree}
                      {edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                    </h5>
                    <span className="font-mono text-[11px] text-slate-600 tabular-nums">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                  <p className="text-slate-700">
                    {edu.institution}
                    {edu.country ? `, ${edu.country}` : ''}
                  </p>
                  {edu.honorsOrThesis && <p className="text-[11.5px] italic text-slate-600">{edu.honorsOrThesis}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Matrix */}
        {languages.length > 0 && (
          <section className="mt-5 break-inside-avoid">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-2">
              05. Language Proficiency (UN Official & Working Languages)
            </h4>
            <table className="w-full text-left text-[11.5px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1 font-medium">Language</th>
                  <th className="py-1 font-medium">Speaking</th>
                  <th className="py-1 font-medium">Reading</th>
                  <th className="py-1 font-medium">Writing</th>
                </tr>
              </thead>
              <tbody>
                {languages.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100">
                    <td className="py-1.5 font-medium text-slate-900">{l.language}</td>
                    <td className="py-1.5 text-slate-700">{l.speaking}</td>
                    <td className="py-1.5 text-slate-700">{l.reading}</td>
                    <td className="py-1.5 text-slate-700">{l.writing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Publications */}
        {publicationsOrAwards.length > 0 && (
          <section className="mt-5 break-inside-avoid">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-2">
              06. Publications, Fellowships & Honours
            </h4>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              {publicationsOrAwards.map((pub, idx) => (
                <li key={idx}>{pub}</li>
              ))}
            </ul>
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section className="mt-5 break-inside-avoid">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#005A9C] border-b border-slate-200 pb-1 mb-2">
              07. Professional References
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {references.map((ref) => (
                <div key={ref.id} className="text-[11.5px]">
                  <p className="font-semibold text-slate-900">{ref.name}</p>
                  <p className="text-slate-700">
                    {ref.title} · {ref.organization}
                  </p>
                  <p className="text-slate-500 font-mono tabular-nums">
                    {ref.email}
                    {ref.phone ? ` · ${ref.phone}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  if (template === 'europass') {
    return (
      <div
        id="cv-print-sheet"
        className="w-full bg-white text-slate-900 p-8 sm:p-10 shadow-sm border border-slate-200 text-[12.5px] leading-[1.55]"
      >
        <div className="flex items-start justify-between gap-6 border-b border-slate-300 pb-6">
          <div className="flex items-start gap-5">
            {personal.photoDataUrl && (
              <img
                src={personal.photoDataUrl}
                alt={personal.fullName || 'Candidate photo'}
                className="h-24 w-24 rounded-full object-cover border border-slate-300 shrink-0"
              />
            )}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#005A9C]">
                Curriculum Vitae · International Academic & Fellowship Standard
              </p>
              <h3 className="mt-1 font-editorial text-2xl font-bold text-slate-950">
                {personal.fullName || 'Applicant Full Name'}
              </h3>
              {personal.targetTitle && (
                <p className="mt-0.5 text-sm text-slate-700 font-medium">{personal.targetTitle}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-slate-600">
                {personal.nationality && <span>Nationality: {personal.nationality}</span>}
                {personal.location && <span>· {personal.location}</span>}
                {personal.email && <span>· {personal.email}</span>}
                {personal.phone && <span className="font-mono tabular-nums">· {personal.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {summary && (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Research & Career Objective
              </div>
              <div className="col-span-12 sm:col-span-9 text-slate-800 whitespace-pre-line">{summary}</div>
            </div>
          )}

          {education.length > 0 && (
            <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-5">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Education & Training
              </div>
              <div className="col-span-12 sm:col-span-9 space-y-3.5">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-slate-950">
                        {edu.degree} — {edu.fieldOfStudy}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {edu.startYear}–{edu.endYear}
                      </span>
                    </div>
                    <p className="text-slate-700">
                      {edu.institution}
                      {edu.country ? `, ${edu.country}` : ''}
                    </p>
                    {edu.honorsOrThesis && <p className="text-[11.5px] text-slate-600 mt-0.5">{edu.honorsOrThesis}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {experiences.length > 0 && (
            <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-5">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Work & Research Experience
              </div>
              <div className="col-span-12 sm:col-span-9 space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-slate-950">{exp.role}</span>
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium">
                      {exp.organization}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </p>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-1 list-disc pl-4 space-y-1 text-slate-700">
                        {exp.achievements.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-5 break-inside-avoid">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Languages (CEFR)
              </div>
              <div className="col-span-12 sm:col-span-9 space-y-1.5">
                {languages.map((l) => (
                  <div key={l.id} className="flex flex-wrap justify-between border-b border-slate-100 pb-1">
                    <span className="font-medium text-slate-900">{l.language}</span>
                    <span className="text-[11.5px] text-slate-600">
                      Speaking: {l.speaking} · Reading: {l.reading} · Writing: {l.writing}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(technicalSkills.length > 0 || competencies.length > 0) && (
            <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-5 break-inside-avoid">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Skills & Competencies
              </div>
              <div className="col-span-12 sm:col-span-9 space-y-1.5 text-slate-700">
                {competencies.length > 0 && <p>Core: {competencies.join(' · ')}</p>}
                {technicalSkills.length > 0 && <p>Digital & Analytical: {technicalSkills.join(' · ')}</p>}
              </div>
            </div>
          )}

          {publicationsOrAwards.length > 0 && (
            <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-5 break-inside-avoid">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Publications & Awards
              </div>
              <ul className="col-span-12 sm:col-span-9 list-disc pl-4 space-y-1 text-slate-700">
                {publicationsOrAwards.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {references.length > 0 && (
            <div className="grid grid-cols-12 gap-4 border-t border-slate-200 pt-5 break-inside-avoid">
              <div className="col-span-12 sm:col-span-3 text-[11px] font-semibold uppercase tracking-wider text-[#005A9C]">
                Academic & Work Referees
              </div>
              <div className="col-span-12 sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {references.map((r) => (
                  <div key={r.id} className="text-[11.5px]">
                    <p className="font-semibold text-slate-900">{r.name}</p>
                    <p className="text-slate-600">
                      {r.title}, {r.organization}
                    </p>
                    <p className="font-mono text-slate-500">{r.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // International Executive template
  return (
    <div
      id="cv-print-sheet"
      className="w-full bg-white text-slate-900 p-8 sm:p-10 shadow-sm border border-slate-200 text-[12.5px] leading-[1.6]"
    >
      <div className="text-center border-b border-slate-300 pb-5">
        <h3 className="font-editorial text-3xl font-semibold text-slate-950 tracking-tight">
          {personal.fullName || 'Applicant Full Name'}
        </h3>
        {personal.targetTitle && (
          <p className="mt-1 text-sm font-medium text-[#005A9C]">{personal.targetTitle}</p>
        )}
        <p className="mt-2 text-[11.5px] text-slate-600">
          {[personal.location, personal.nationality ? `Nationality: ${personal.nationality}` : '', personal.email, personal.phone, personal.linkedin]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>

      {summary && (
        <section className="mt-5">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 mb-1.5">
            Executive Summary
          </h4>
          <p className="text-slate-700">{summary}</p>
        </section>
      )}

      {experiences.length > 0 && (
        <section className="mt-5 border-t border-slate-200 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 mb-3">
            International & Leadership Experience
          </h4>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-slate-950">
                    {exp.role} — <span className="font-normal text-slate-700">{exp.organization}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-[11.5px] text-slate-500">{exp.location}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-700">
                    {exp.achievements.map((a, idx) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="mt-5 border-t border-slate-200 pt-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 mb-2.5">
            Education
          </h4>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between gap-2 break-inside-avoid">
                <div>
                  <span className="font-semibold text-slate-950">
                    {edu.degree}, {edu.fieldOfStudy}
                  </span>
                  <span className="text-slate-600">
                    {' '}
                    — {edu.institution}
                    {edu.country ? `, ${edu.country}` : ''}
                  </span>
                  {edu.honorsOrThesis && <p className="text-[11.5px] text-slate-500">{edu.honorsOrThesis}</p>}
                </div>
                <span className="font-mono text-[11px] text-slate-500 tabular-nums shrink-0">
                  {edu.startYear}–{edu.endYear}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(competencies.length > 0 || technicalSkills.length > 0 || languages.length > 0) && (
        <section className="mt-5 border-t border-slate-200 pt-4 space-y-1.5 break-inside-avoid">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 mb-2">
            Core Competencies, Technical Skills & Languages
          </h4>
          {competencies.length > 0 && (
            <p className="text-slate-700">
              <strong className="text-slate-900">Competencies:</strong> {competencies.join(' · ')}
            </p>
          )}
          {technicalSkills.length > 0 && (
            <p className="text-slate-700">
              <strong className="text-slate-900">Technical Skills:</strong> {technicalSkills.join(' · ')}
            </p>
          )}
          {languages.length > 0 && (
            <p className="text-slate-700">
              <strong className="text-slate-900">Languages:</strong>{' '}
              {languages.map((l) => `${l.language} (${l.speaking})`).join(' · ')}
            </p>
          )}
        </section>
      )}

      {references.length > 0 && (
        <section className="mt-5 border-t border-slate-200 pt-4 break-inside-avoid">
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-900 mb-2">
            References
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {references.map((r) => (
              <div key={r.id} className="text-[11.5px]">
                <p className="font-semibold text-slate-900">{r.name}</p>
                <p className="text-slate-600">
                  {r.title} · {r.organization}
                </p>
                <p className="font-mono text-slate-500">{r.email}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
