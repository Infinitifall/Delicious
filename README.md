# Delicious

A blog template built with Jekyll

***Note**: I've since ported my website to Hugo and created the near identical template [Succulent](https://github.com/Infinitifall/Succulent), which I recommend over Jekyll.*

## Features

- Tactile and minimalist theme
- Base page size < 256kB
- Responsive design, looks good on Desktop, Laptop, Tablet and Mobile
- Embeds on social media sites like Facebook, Twitter, Slack
- Server side rendered LaTeX that works without JavaScript


## Screenshots

![Light theme screenshot](assets/images/light.jpeg)

![Dark theme screenshot](assets/images/dark.jpeg)

## Install

Install ruby and rubygems first. They are available in the official repositories of all the major distributions. On Arch Linux, this would be

```bash
sudo pacman -S ruby rubygems
```

Install and set up bundle correctly

```bash
gem install bundler

# add local ruby gems to your $PATH
export PATH=~/.local/share/gem/ruby/3.0.0/bin:$PATH

# tell bundle where to install local gems
bundle config set --local path ~/.gem
```

Then clone this repo and install dependencies

```bash
# clone this website template and install dependencies
git clone https://github.com/Infinitifall/Delicious
cd Delicious
bundle install

# serve website locally
bundle exec jekyll serve

# or build the website
bundle exec jekyll build
```
