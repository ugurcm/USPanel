FROM php:7.2.2-apache

RUN apt-get update && apt-get install -y \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-install -j$(nproc) iconv \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd 


RUN rm /etc/apt/preferences.d/no-debian-php 
RUN apt-get update -y \
  && apt-get install -y \
    libxml2-dev \
  && apt-get clean -y 


RUN apt-get update -y && \
    apt-get install -y libmcrypt-dev && \
    pecl install mcrypt-1.0.1 && \
    docker-php-ext-enable mcrypt

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl xml
RUN docker-php-ext-configure gd --with-gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/
RUN docker-php-ext-install gd

RUN a2enmod rewrite

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add user for laravel application
RUN groupadd -g 1000 www
RUN useradd -u 1000 -ms /bin/bash -g www www


COPY ./docker/apache/demo.apache.conf /usr/local/apache2/conf/demo.apache.conf
RUN echo "Include /usr/local/apache2/conf/demo.apache.conf" \
    >> /usr/local/apache2/conf/httpd.conf

ENV INSTALL_PATH /home/corehound/Documents/Work/Ozel/CodeIgniterTest
WORKDIR $INSTALL_PATH

COPY ./src /var/www/html


#COPY --chown=www:www . /var/www

#RUN chown -R $USER:www-data storage
#RUN chown -R $USER:www-data bootstrap/cache

# Change current user to www
#USER www
#RUN chown www-data:www-data /var/www/html/
#RUN chown -R www-data:www-data /var/www/html/writable
RUN chown -R www-data:www-data /var/www/html/writable
#RUN chmod -R 777 /var/www/html/writable
#RUN chown -R $USER:www /var/www/html/writable
