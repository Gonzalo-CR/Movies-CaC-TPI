-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema mymovies
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mymovies
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mymovies` DEFAULT CHARACTER SET utf8 ;
USE `mymovies` ;

-- -----------------------------------------------------
-- Table `mymovies`.`Countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymovies`.`Countries` (
  `CountryID` INT NOT NULL AUTO_INCREMENT,
  `CountryName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`CountryID`),
  UNIQUE INDEX `idcountries_UNIQUE` (`CountryID` ASC) ,
  UNIQUE INDEX `CountryName_UNIQUE` (`CountryName` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymovies`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymovies`.`Users` (
  `UserID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Surname` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(45) NOT NULL,
  `Birthday` DATETIME NOT NULL,
  `ProfilePicture` VARCHAR(255) NULL,
  `Countries_CountryID` INT NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `id_UNIQUE` (`UserID` ASC) ,
  UNIQUE INDEX `email_UNIQUE` (`Email` ASC) ,
  INDEX `fk_Users_Countries_idx` (`Countries_CountryID` ASC) ,
  CONSTRAINT `fk_Users_Countries`
    FOREIGN KEY (`Countries_CountryID`)
    REFERENCES `mymovies`.`Countries` (`CountryID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymovies`.`Genres`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymovies`.`Genres` (
  `GenreID` INT NOT NULL AUTO_INCREMENT,
  `GenreName` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`GenreID`),
  UNIQUE INDEX `idgenres_UNIQUE` (`GenreID` ASC) ,
  UNIQUE INDEX `GenreName_UNIQUE` (`GenreName` ASC) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymovies`.`Movies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymovies`.`Movies` (
  `MovieID` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(255) NOT NULL,
  `Director` VARCHAR(255) NOT NULL,
  `Year` INT NOT NULL,
  `CoverImage` VARCHAR(255) NOT NULL,
  `Countries_CountryID` INT NOT NULL,
  `Genres_GenreID` INT NOT NULL,
  PRIMARY KEY (`MovieID`),
  UNIQUE INDEX `idmovies_UNIQUE` (`MovieID` ASC) ,
  INDEX `fk_Movies_Countries1_idx` (`Countries_CountryID` ASC) ,
  INDEX `fk_Movies_Genres1_idx` (`Genres_GenreID` ASC) ,
  CONSTRAINT `fk_Movies_Countries1`
    FOREIGN KEY (`Countries_CountryID`)
    REFERENCES `mymovies`.`Countries` (`CountryID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Movies_Genres1`
    FOREIGN KEY (`Genres_GenreID`)
    REFERENCES `mymovies`.`Genres` (`GenreID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymovies`.`User_Movie_Watches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymovies`.`User_Movie_Watches` (
  `UserMovieWatchID` INT NOT NULL AUTO_INCREMENT,
  `WatchDate` DATETIME NOT NULL,
  `Users_UserID` INT NOT NULL,
  `Users_Countries_CountryID` INT NOT NULL,
  `Movies_MovieID` INT NOT NULL,
  `Movies_Countries_CountryID` INT NOT NULL,
  `Movies_Genres_GenreID` INT NOT NULL,
  PRIMARY KEY (`UserMovieWatchID`),
  UNIQUE INDEX `iduser_movie_watch_UNIQUE` (`UserMovieWatchID` ASC) ,
  INDEX `fk_User_Movie_Watches_Users1_idx` (`Users_UserID` ASC, `Users_Countries_CountryID` ASC) ,
  INDEX `fk_User_Movie_Watches_Movies1_idx` (`Movies_MovieID` ASC, `Movies_Countries_CountryID` ASC, `Movies_Genres_GenreID` ASC) ,
  CONSTRAINT `fk_User_Movie_Watches_Users1`
    FOREIGN KEY (`Users_UserID` , `Users_Countries_CountryID`)
    REFERENCES `mymovies`.`Users` (`UserID` , `Countries_CountryID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_Movie_Watches_Movies1`
    FOREIGN KEY (`Movies_MovieID` , `Movies_Countries_CountryID` , `Movies_Genres_GenreID`)
    REFERENCES `mymovies`.`Movies` (`MovieID` , `Countries_CountryID` , `Genres_GenreID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mymovies`.`User_Movie_Ratings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mymovies`.`User_Movie_Ratings` (
  `UserMovieRatingID` INT NOT NULL AUTO_INCREMENT,
  `RatingDate` DATETIME NOT NULL,
  `Rating` INT NOT NULL,
  `Users_UserID` INT NOT NULL,
  `Users_Countries_CountryID` INT NOT NULL,
  `Movies_MovieID` INT NOT NULL,
  `Movies_Countries_CountryID` INT NOT NULL,
  `Movies_Genres_GenreID` INT NOT NULL,
  PRIMARY KEY (`UserMovieRatingID`),
  UNIQUE INDEX `iduser_movie_ranking_UNIQUE` (`UserMovieRatingID` ASC) ,
  INDEX `fk_User_Movie_Ratings_Users1_idx` (`Users_UserID` ASC, `Users_Countries_CountryID` ASC) ,
  INDEX `fk_User_Movie_Ratings_Movies1_idx` (`Movies_MovieID` ASC, `Movies_Countries_CountryID` ASC, `Movies_Genres_GenreID` ASC) ,
  CONSTRAINT `fk_User_Movie_Ratings_Users1`
    FOREIGN KEY (`Users_UserID` , `Users_Countries_CountryID`)
    REFERENCES `mymovies`.`Users` (`UserID` , `Countries_CountryID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_User_Movie_Ratings_Movies1`
    FOREIGN KEY (`Movies_MovieID` , `Movies_Countries_CountryID` , `Movies_Genres_GenreID`)
    REFERENCES `mymovies`.`Movies` (`MovieID` , `Countries_CountryID` , `Genres_GenreID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
