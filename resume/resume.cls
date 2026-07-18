% resume.cls — Jake's Resume class
% Based on https://github.com/jakegut/resume

\ProvidesClass{resume}[2024/01/01 Resume Class]
\NeedsTeXFormat{LaTeX2e}

\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass{article}

\usepackage[parfill]{parskip}   % no indent on new paragraph
\usepackage{array}              % bold tabular columns
\usepackage{ifthen}
\usepackage[left=0.5in,top=0.5in,right=0.5in,bottom=0.5in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}

\pagestyle{empty}               % no page numbers

% ---- Name / Header ----
\def\name#1{\def\@name{#1}}
\def\@name{}

\def\printname{
  \begingroup
    \hfil{\MakeUppercase{\namesize\bf \@name}}\hfil
    \nameskip\break
  \endgroup
}

% ---- Section formatting ----
\newenvironment{rSection}[1]{
  \sectionskip
  \MakeUppercase{\bf #1}
  \sectionlineskip
  \hrule
  \begin{list}{}{
    \setlength{\leftmargin}{1.5em}
  }
  \item[]
}{
  \end{list}
}

% ---- Subsection: {Company}{Location}{Role}{Dates} ----
\newenvironment{rSubsection}[4]{
  {\bf #1} \hfill {#2}
  \ifthenelse{\equal{#3}{}}{}{
    \\
    {\em #3} \hfill {\em #4}
  }
  \smallskip
  \begin{list}{$\cdot$}{\leftmargin=0em}
    \setlength{\itemsep}{-0.5em} \vspace{-0.5em}
}{
  \end{list}
  \vspace{0.5em}
}

% ---- Sizing ----
\def\namesize{\huge}
\def\nameskip{\medskip}
\def\sectionskip{\medskip}
\def\sectionlineskip{\medskip}
